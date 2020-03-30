import { Configuration } from '../base/custom';
import * as mysql from "mysql";
import { AbstractDao, IDaoBasic } from "./AbstractDao";
import { RunningStatus } from "../base/custom";
import { enumRunningStatus } from "../base/enums";
import { MySQLStatements } from '../sql/MySQLStatements';
import { RequestInfo } from '../base/requestInfo';
import { AbstractApiRouting } from '../imp/ApiRouting';
import { ColumnPropertyJDB } from '../base/jsonDB';


export class DaoMySQL extends AbstractDao implements IDaoBasic {
  public config: Configuration;
  public status: RunningStatus;

  executeSqlOld = (sql: string, callback: any) => this.db.query(sql, callback);
  executeSql = (sql: string, callback: any) => {
    let goOn = true;
    this.open((error: Error) => { if (error) { callback(error); goOn = false } });
    if (!goOn) return;
    this.db.query(sql, callback);
    this.close((error: Error) => { if (error) callback(error) });
  };


  constructor(
    public server: any,
    public callback?: { (error: Error, routing: AbstractApiRouting): void }
  ) {
    super();
    this.config = server.config;
    this.status = server.status;
    this.sqlStatements = new MySQLStatements();
  }
 
  async open(callback?: any) {
    this.db = mysql.createConnection({
      host: this.config.host,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      port: this.config.port
    });
    this.db.connect((error: Error) => {
      if (callback) {
        if (error) callback(error);
        else callback(null);
      }
    })
  }

  close = async (callback?: any) => {
    this.db.end();
  }


  async connect() {
    this.status.DbConnect = enumRunningStatus.DbConnectInitializing;
    const self = this;
    this.getDbInfo((error: Error, result: any) => {
      if (result) {
        if (result == "1") {
          self.callback(null, self.server.routing);
          console.log("Connected to " + this.config.databaseType + ": `" + this.config.database + "` on process:" + process.pid + ".");
          this.status.DbConnect = enumRunningStatus.DbConnectConnected;
        }
      }
      if (error) self.server.addError(error);
    })
  };

  getDbInfo(callback?: any) {
    const sql = this.sqlStatements.tableColumnInfo(this.config.database);
    const self = this;
    this.executeSql(sql, (error: Error, result: any) => {
      if (error && callback) callback(error);
      if (result) {
        result.forEach((row: any) => { row.table_name = row.table_name.toLowerCase() })
        self.dbInfo = new ColumnPropertyJDB(result);
      }
      if (callback) callback(null, "1");
    });
  }

  createTable(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.columnProperties(requestInfo);
    const sql = this.sqlStatements.createTable(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      this.getDbInfo((error: Error) => {
        if (error) callback(error)
        else {
          tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp != null);
        }
      })
    })
  }

  deleteTable(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.columnProperties(requestInfo);
    const sql = this.sqlStatements.deleteTable(requestInfo);
    this.executeSql(sql, (error: Error) => {
      if (error) callback(error);
      this.getDbInfo((error: Error) => {
        if (error) callback(error)
        else {
          tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp != null);
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
    requestInfo.dataType = columnProp[0].data_type;
    return this.createColumn(requestInfo, (error: Error, result: any) => {
      callback(error, result)
    });
  }

  async getItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.selectWithId(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      callback(null, result);
    });
  }

  async getAllItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.selectFromRequestInfo(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      callback(null, result);
    });
  }

  async countItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.countSelectRequestInfo(requestInfo);
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result);
      callback(null, 0);
    });
  }

  async addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    let sql = this.sqlStatements.insert(
      requestInfo,
      body,
      columnProperties,
      "`", "`"
    );
    this.executeSql(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, `${result.insertId}`);
    })
  }

  async updateItem(requestInfo: RequestInfo, id: any, body: { [k: string]: any }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    let sql = this.sqlStatements.updateWithIdFromBody(
      requestInfo,
      id,
      identityColumn,
      columnProperties,
      body, "`", "`"
    );
    this.executeSql(sql, function (error: Error) {
      if (error) callback(error);
      callback(null, requestInfo.id);
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
    this.executeSql(sql, (error: Error, result: any) => {
      if (error) callback(error);
      callback(result);
    });
  }

  async deleteItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.deleteWithId(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeSql(sql, function (error: Error, result: any) {
      if (error) callback(error);
      callback(null, "1");
    });
  }
}