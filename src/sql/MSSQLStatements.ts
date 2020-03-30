import { RequestInfo } from '../base/requestInfo';
import { AbstractSQL } from "./abstractSql";


export class MSSQLStatements extends AbstractSQL{
  createTable(requestInfo: RequestInfo) {
    let tableName = requestInfo.tableName;
    return `if not exists (select * from sysobjects where name='${tableName}' and xtype='U') CREATE TABLE [${tableName}] (Id UNIQUEIDENTIFIER PRIMARY KEY default NEWID())`;
  }

  deleteTable(requestInfo: RequestInfo) {
    return `if exists (select * from sysobjects where name='${requestInfo.tableName}' and xtype='U')
    Drop TABLE [${requestInfo.tableName}]`;
  }

  createColumn(requestInfo: RequestInfo) {
    const tableName = requestInfo.tableName;
    const columnName = requestInfo.columnName;
    let columnType: string;
    switch (requestInfo.dataType.toLowerCase()) {
      case 'string':
      case 'text':
      case 'varchar':
      case 'nvarchar':
        columnType = "nvarchar(max)";
        break;
      case 'integer':
      case 'int':
        columnType="INTEGER";
        break;
      case 'number':
        columnType = "float(24)";
        break;
      case 'bool':
      case 'boolean':
        columnType = "BOOLEAN";
        break;
      case 'datetime':
      case 'date':
        columnType = "date";
        break;
      default:
        columnType = "nvarchar(max)";
        break;
    }

    return `if exists (select * from sysobjects where name='${requestInfo.tableName}' and xtype='U') 
    ALTER TABLE [${tableName}] 
    ADD [${columnName}] ${columnType} null`;
  }
    // static GetSelectStatement(tableName) {
    //   return `select * from ${tableName};`;
    // }
  
    tableColumnInfo() {
      return `SELECT n.name AS table_name, 
      n.table_type, 
      c.name AS column_name, 
      iif(q.column_name=c.name,1,0) as column_is_pk,
      UPPER(s.name) AS data_type
      FROM   (SELECT name, type_desc, object_id, 'table' AS table_type
                   FROM    sys.tables
                   WHERE  (name <> '__EFMigrationsHistory')
                   UNION
                   SELECT name, type_desc, object_id, 'view' AS table_type
                   FROM   sys.views) AS n LEFT OUTER JOIN
                   sys.columns AS c ON n.object_id = c.object_id INNER JOIN
                   sys.systypes AS s ON c.system_type_id = s.xtype LEFT OUTER JOIN
                   INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS q ON c.name = q.COLUMN_NAME AND n.name = q.TABLE_NAME
      WHERE (s.name <> 'sysname')`;
    }

    insert(requestInfo:RequestInfo, body:{[k:string]:any}, columnProperties:any, ldelimiter:string="[", rdelimiter:string="]" ) {
      const sql = `Insert into ${requestInfo.unitId} `;
      const asqlColumns = [];
      const asqlValues = [];
      let primaryKey:string;
      let insertInfo:{[k: string]: any;}=body;
      for (let i = 0; i < columnProperties.length; i++) {
          const prop = columnProperties[i];
          if (prop.column_is_pk==1) primaryKey = prop.column_name;
          if (insertInfo[prop.column_name] != null) {
              if (prop.column_is_pk == 0) {
                  asqlColumns.push(prop.column_name);
                  switch (prop.data_type.toUpperCase()) {
                      case "TEXT":
                      case "NVARCHAR":
                      case "VARCHAR":
                        insertInfo[prop.column_name]=insertInfo[prop.column_name].replace("'","''");
                      case "DATE":
                          asqlValues.push("'" + insertInfo[prop.column_name] + "'");
                          break;
                      case "BOOL":
                      case "BOOLEAN":
                      case "INTEGER":
                      case "REAL":
                      case "NUMERIC":
                      case "INT":
                      case "BIGINT":
                          asqlValues.push(insertInfo[prop.column_name]);
                          break;
                  }
              }
          }
      }
      return (
          sql + "("+ ldelimiter + asqlColumns.join(rdelimiter+","+ldelimiter) +
          rdelimiter+") OUTPUT inserted."+primaryKey+" as lastID Values (" + asqlValues.join(", ") + ")");
  }
  }