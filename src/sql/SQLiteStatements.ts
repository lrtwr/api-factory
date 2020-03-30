import { RequestInfo } from '../base/requestInfo';
import { AbstractSQL } from './abstractSql';

export class SQLiteStatements extends AbstractSQL {
  tableColumnInfo() {
    return `SELECT m.name AS table_name, 
    p.name AS column_name,
    m.type As table_type,
    p.type AS data_type,
	p.pk AS column_is_pk
  FROM sqlite_master m
  JOIN pragma_table_info((m.name)) p`;
  }
  createTable(requestInfo: RequestInfo) {
    return `CREATE TABLE IF NOT EXISTS '${requestInfo.tableName}' (
    "Id"	INTEGER PRIMARY KEY AUTOINCREMENT
  )`;
  }

  deleteTable(requestInfo: RequestInfo) {
    return `DROP TABLE IF EXISTS '${requestInfo.tableName}'`;
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
        columnType = "TEXT";
        break;
      case 'integer':
      case 'int':
        columnType = "INTEGER";
        break;
      case 'number':
        columnType = "REAL";
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
        columnType = "TEXT";
        break;
    }
    return `ALTER TABLE "${tableName}" 
    ADD COLUMN "${columnName}" ${columnType} null`;
  }
}


