import { RequestInfo } from '../base/RequestInfo';
import { AbstractSQL } from './abstractSql';

export class MySQLStatements extends AbstractSQL{
    CreateTable(requestInfo: RequestInfo) {
      return `CREATE TABLE if not exists ${requestInfo.tableName} (Id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (Id))`;
    }
    DeleteTable(requestInfo: RequestInfo) {
      return `DROP TABLE if exists ${requestInfo.tableName}`;
    }
    aaaCreateColumn(requestInfo: RequestInfo) {
      return "ALTER TABLE `"+ requestInfo.tableName+"` Add Column `"+requestInfo.columnName+"` TEXT null"


    }
    CreateColumn(requestInfo: RequestInfo) {
      const tableName = requestInfo.tableName;
      const columnName = requestInfo.columnName;
      let dataType: string;
      switch (requestInfo.dataType.toLowerCase()) {
        case 'string':
        case 'text':
        case 'varchar':
        case 'nvarchar':
          dataType = "TEXT";
          break;
        case 'integer':
        case 'int':
          dataType= "INTEGER"
          break;
        case 'number':
          dataType = "float(24)";
          break;
        case 'bool':
        case 'boolean':
          dataType = "BOOLEAN";
          break;
        case 'datetime':
        case 'date':
          dataType = "date";
          break;
        default:
          dataType = "TEXT";
          break;
      }
  
      return "ALTER TABLE `"+ requestInfo.tableName+"` Add Column `"+columnName+"` "+ dataType+" null";
    }

    GetTableColumnInfoStatement(databaseName?: string) {
      return `Select 
      col.table_schema as table_schema,
      case 
     when vie.table_type = 'BASE TABLE' then 'table' 
     when vie.table_type = 'VIEW' then 'view' 
     else 'other' 
     end as table_type,
      col.table_name as table_name, 
      col.column_name as column_name, 
      col.column_default as default_val, 
      col.is_nullable = "YES" as is_nullable, 
      upper(col.data_type) as data_type, 
      col.column_key='PRI' as column_is_pk  
      FROM information_schema.columns col 
  join information_schema.tables vie on vie.table_schema = col.table_schema
                                and vie.table_name = col.table_name
  where col.table_schema not in ('sys','information_schema',
                             'mysql', 'performance_schema')
  and vie.table_schema = '${databaseName}' 
  order by col.table_name, col.ordinal_position;
  `;
    }
  }