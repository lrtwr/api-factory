import { ApiServer } from './../imp/ApiServer';
import { Configuration } from '../base/custom';
import { SQLiteStatements } from "../sql/SQLiteStatements";
import { RunningStatus, JsonDatabase } from "../base/custom";
import { enumRunningStatus, enumDatabaseType } from "../base/enums";
import * as sqlite3 from 'sqlite3';
import { AbstractDao, IDaoBasic } from './AbstractDao';
import { RequestInfo } from '../base/RequestInfo';
import { AbstractApiRouting } from '../imp/ApiRouting';

sqlite3.verbose();

export class DaoSQLite extends AbstractDao implements IDaoBasic {
  executeSql = (sql: string, callback: any) => this.db.run(sql, callback);

  executeRun = (sql: string, callback: any) => {
    let goOn = true;
    this.open((error: Error) => { if (error) { callback(error); goOn = false } });
    if (!goOn) return;
    this.db.run(sql, callback);
    this.close((error: Error) => { if (error) callback(error) });
  }

  executeAll = (sql: string, callback: any) => {
    let goOn = true;
    this.open((error: Error) => { if (error) { callback(error); goOn = false } });
    if (!goOn) return;
    this.db.all(sql, callback);
    this.close((error: Error) => { if (error) callback(error) });
  }

  public config: Configuration;
  public status: RunningStatus;
  constructor(
    public server: any,
    public setupCallback?: { (error: Error, routing: AbstractApiRouting): void }
  ) {
    super();
    this.config = server.config;
    this.status = server.status;
    this.sqlStatements = new SQLiteStatements();
  }

  connect(callback?: any) {
    const self = this;
    this.status.DbConnect = enumRunningStatus.DbConnectInitializing;
    let _error: Error;
    if (this.config.databaseType == enumDatabaseType.SQLiteMemory) {
      this.db = new sqlite3.Database(this.config.database, null, function (error) {
        if (error) { _error = error; }
      })
    }
    else {
      this.db = new sqlite3.Database(this.config.database, sqlite3.OPEN_READWRITE, function (error) {
        if (error) { _error = error; }
      })
    }
    this.close();
    if (_error) {
      if (callback) callback(_error);
      return;
    }

    self.getDbInfo((error: Error) => {
      if (error) {
        self.status.DbConnect = enumRunningStatus.DbConnectError;
        self.server.addError(error);
        if (callback) callback(error);
      }
      else{
      self.setupCallback(null, self.server.routing);
      self.status.DbConnect = enumRunningStatus.DbConnectConnected;
      console.log("Connected to SQLite database: `" + self.config.database + "` on process:" + process.pid + ".");
      if (callback) callback(null);
      }
    })
  }

  async open(callback?: any) {
    if (this.config.databaseType == enumDatabaseType.SQLiteMemory) return;
    this.db = new sqlite3.Database(this.config.database, null, (error: Error) => {
      if (callback) {
        if (error) callback(error);
        else callback(null);
      }
    })
  }

  async close(callback?: any) {
    if (this.config.databaseType == enumDatabaseType.SQLiteMemory) return;
    if (!this.db) return;
    this.db.close((error: Error) => {
      if (callback) {
        if (error) callback(error);
        else callback(null);
      }
    });
  }
  
  getDbInfo(callback?: any) {
    const sql = this.sqlStatements.GetTableColumnInfoStatement();
    const self = this;
    this.executeAll(sql, (error: Error, result: any) => {
      const tmp: any[] = [];
      result.forEach((row: any) => {
        row.table_name = row.table_name.toLowerCase();
        if (row.table_name != "sqlite_sequence") tmp.push(row);
      })
      self.tableProperties = new JsonDatabase(tmp, [
        "table_name",
        "table_type"
      ]);
      if (callback) {
        if (error) callback(error);
        callback(null);
      }
    });
  }

  createTable(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.columnProperties(requestInfo);
    const sql: string = this.sqlStatements.CreateTable(requestInfo);
    this.executeRun(sql, (error: Error) => {
      if (error) callback(error)
      else {
        this.getDbInfo((error: Error) => {
          if (error) callback(error)
          tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp != null);
        })
      }
    })
  }

  deleteTable(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.DeleteTable(requestInfo);
    this.executeRun(sql, (error: Error) => {
      if (error) callback(error);
      this.getDbInfo((error: Error) => {
        if (error) callback(error);
        const tableProp = this.columnProperties(requestInfo);
        callback(null, tableProp != null);
      })
    })
  }

  createColumn(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.models();
    if (tableProp[requestInfo.tableName][requestInfo.columnName]) callback(null, "Column '" + requestInfo.columnName + " from table " + (requestInfo.tableName) + "' already exists.");
    else {
      const sql = this.sqlStatements.CreateColumn(requestInfo);
      this.executeRun(sql, (error: Error, result: any) => {
        if (error) callback(error);
        this.getDbInfo((error: Error) => {
          if (error) callback(error);
          tableProp = this.models();
          callback(null, tableProp[requestInfo.tableName][requestInfo.columnName] != null);
        })
      })
    }
  }

  createForeignKey(requestInfo: RequestInfo, callback: any) {
    requestInfo.columnName = requestInfo.targetTable + "Id";
    const columnProp: any[] = this.columnProperties(requestInfo);
    requestInfo.dataType = columnProp[0].data_type;
    return this.createColumn(requestInfo, (error: Error, result: any) => {
      callback(error, result)
    });
  }

   updateItem(requestInfo: RequestInfo, id: any, body: any, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    let sql = this.sqlStatements.GetUpdateFromBodyStatement(
      requestInfo,
      id,
      identityColumn,
      columnProperties,
      body
    );
    this.executeRun(sql, function (error: Error, result?: any) {
      if (error) callback(error);
      if (result) callback(null, requestInfo.id);
      else callback(null, requestInfo.id);
    })
  }

  addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any) {
    const columnProperties = this.columnProperties(requestInfo);
    let sql = this.sqlStatements.GetInsertStatement(
      requestInfo,
      body,
      columnProperties,
      "[", "]"
    );
    this.executeRun(sql, function (error: Error, result: any) {
      if (error) callback(error)
      else callback(null, `${this.lastID}`);
    })
  }

  getAllItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.GetSelectFromRequestInfo(requestInfo);
    this.executeAll(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, result);

    });
  }

  countItems(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.GetCountSelectRequestInfo(requestInfo);
    this.executeAll(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, result)
      else callback(null, 0);
    });
  }

  getItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetSelectWithIdStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeAll(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, result);
    });
  }

  itemExists(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetIdExistStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeAll(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(result);
    });
  }

  async deleteItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetDeleteWithIdStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeRun(sql, function (error: Error, result: any) {
      if (error) callback(error);
      if (result) callback(null, itemId)
      else callback(null, itemId);
    });
  }
}