import { RequestInfo } from '../base/requestInfo';
import { ApiServer } from '../imp/ApiServer';
import { enumRunningStatus } from '../base/enums';
import { AbstractDao, IDaoBasic } from './AbstractDao';
import { RunningStatus, Configuration } from '../base/custom';
import { MSSQLStatements } from '../sql/MSSQLStatements';
import { AbstractApiRouting } from '../imp/ApiRouting';
import { pool } from 'mssql';
import { ColumnPropertyJDB } from '../base/jsonDB';

const mssql = require('mssql')
export class DaoMSSQL extends AbstractDao implements IDaoBasic {

  executeSqlOld = (sql: string, callback: any) => this.db.query(sql, callback);

  executeSql = (sql: string, callback: any) => {
    var self = this;
    this.db.connect()
      .then((conn: any) => {
        conn.query(sql)
          .then((result: any) => callback(null, result))
          .then(() => conn.close())
          .catch((error: Error) => {
            conn.close()
            callback(error)
          })
      }
      )
  }

  public config: Configuration;
  public status: RunningStatus;
  constructor(
    public server: ApiServer,
    public callback?: { (error: Error, routing: AbstractApiRouting): void }
  ) {
    super();
    this.config = server.config;
    this.status = server.status;
    this.sqlStatements = new MSSQLStatements();;
  }


  public connect() {
    var self = this;
    //this.db = mssql;
    mssql.on('error', (error: Error) => {
      self.server.addError(error);
    })
    this.db = new mssql.ConnectionPool(this.config)

    this.getDbInfo((error: Error, result: any) => {
      if (error) {
        self.server.addError(error);
        self.callback(error, null);
      }
      if (result) {
        if (result == "1") {
          self.callback(null, self.server.routing);
          this.status.DbConnect = enumRunningStatus.DbConnectConnected;
          console.log("Connected to MSSQL: `" + this.config.database + "` on process:" + process.pid + ".");
        }
      }
    })
  }

  getDbInfo(callback?: any) {
    const sql: string = this.sqlStatements.tableColumnInfo(this.config.database);
    const self = this;
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) {
        result.recordset.forEach((row: any) => { row.table_name = row.table_name.toLowerCase() })
        self.dbInfo = new ColumnPropertyJDB(result.recordset);
      }
      if (callback) callback(null, "1");
    });
  }

  createTable(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.createTable(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      this.getDbInfo((error: Error) => {
        if (error) callback(error)
        else {
          const tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp != null);
        }
      })
    })
  }

  deleteTable(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.deleteTable(requestInfo);
    this.executeSql(sql, (error: Error) => {
      if (error) callback(error);
      this.getDbInfo((error: Error) => {
        if (error) callback(error)
        else {
          const tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp == null);
        }
      })
    })
  }

  createColumn(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.models();
    if (tableProp[requestInfo.tableName][requestInfo.columnName]) callback(null, "Column '" + requestInfo.columnName + " from table " + (requestInfo.tableName) + "' already exists.");
    else {
      const sql = this.sqlStatements.createColumn(requestInfo);
      this.executeSql(sql, (error: Error, result: any) => {
        if (error) callback(error);
        this.getDbInfo((error: Error, result: any) => {
          if (error) callback(error)
          else {
            tableProp = this.models();
            callback(null, tableProp[requestInfo.tableName][requestInfo.columnName] != null);
          }
        })
      })
    }
  }

  createForeignKey(requestInfo: RequestInfo, callback: any) {
    requestInfo.columnName = requestInfo.targetTable + "Id";
    const columnProp = this.columnProperties(requestInfo);
    if (!columnProp) callback(null, "Table '" + (requestInfo.tableName) + "' does not exists.");
    else {
      requestInfo.dataType = columnProp[0].data_type;
      return this.createColumn(requestInfo, (error: Error, result: any) => {
        callback(error, result);
      });
    }
  }

  getAllItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.selectFromRequestInfo(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset);
    });
  }

  getItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.selectWithId(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset);
    });
  }

  countItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.countSelectRequestInfo(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset.length);
      callback(null, 0);
    });
  }

  addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    let sql = this.sqlStatements.insert(
      requestInfo,
      body,
      columnProperties,
      "[", "]"
    );
    this.executeSql(sql, function (error: Error, result: any) {
      callback(error, result.recordset);
    })
  }

  updateItem(requestInfo: RequestInfo, id: any, body: { [k: string]: any }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    let sql = this.sqlStatements.updateWithIdFromBody(
      requestInfo,
      id,
      identityColumn,
      columnProperties,
      body,
      "[", "]"
    );
    this.executeSql(sql, function (error: Error, result: any) {
      callback(error, requestInfo.id);
      // if (error) callback(error);
      // if (result) callback(null, id);
    })
  }

  updateAll(requestInfo: RequestInfo, body: { [k: string]: any; }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    let sql = this.sqlStatements.updateFromBody(
      requestInfo,
      columnProperties,
      body
    );
    
    this.executeSql(sql, function (error: Error, result?: any) {
      if (error) callback(error);
      if (result) callback(null, 1);
      else callback(null, 1);
    })
  }

  itemExists(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.idExist(
      requestInfo,
      identityColumn,
      itemId
    );
    this.db.query(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(result.recordset);
    });
  }

  deleteItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.deleteWithId(
      requestInfo,
      identityColumn,
      itemId
    );
    this.db.query(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, result.rowsAffected);
    });
  }
}