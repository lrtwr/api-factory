const sqlite3 = require("sqlite3").verbose();
import { ApiSQLStatements } from "../setup/ApiSQLStatements";
import { factory } from "../setup/factory";


export class daoSQLite extends factory.abstracts.AbstractDaoSupport {
  constructor(
    private server: any,
    private config: any,
    private status: factory.RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = factory.enums.enumRunningStatus.DbConnectInitializing;

    const self = this;
    self.db = new sqlite3.Database(self.config.database, error => {
      if (error) {
        self.status.DbConnect = factory.enums.enumRunningStatus.DbConnectError;
        console.log(error);
        this.server.lastErrors.push(error);
      }
    });
    self.status.DbConnect = factory.enums.enumRunningStatus.DbConnectConnected;
    console.log("Connected to SQLite database: " + self.config.database);
    var sql = ApiSQLStatements.GetSQLiteTableColumnInfoStatement();
    self.db.all(sql, (error, result) => {
      if(error){
        this.server.lastErrors.push(error);
      }
      else{
      self.tableProperties = new factory.jl.jsonDatabase(result, ["table_name", "table_type"]);
      self.callback(self.server);
      
      }
    });
  }

  AsyncPost(tableName, request) {
    const columnProperties = this.GetColumnProperties(tableName);
    const sql = ApiSQLStatements.GetInsertStatement(
      tableName,
      columnProperties,
      request
    );
    return new Promise((resolve, reject) => {
      this.db.run(sql, function (error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`${this.lastID}`);
        console.log(`lastID ${this.lastID}`);
      });
    });
  }

  AsyncDeleteId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const sql: string = ApiSQLStatements.GetDeleteWithIdStatement(
      tableName,
      identityColumn,
      request.params.id
    );
    return new Promise((resolve, reject) => {
      this.db.run(sql, function (error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`{result: 1}`);
        console.log(`result: 1`);
      });
    });
  }

  AsyncPatchId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const sql = ApiSQLStatements.GetUpdateStatement(
      tableName,
      identityColumn,
      this.GetColumnProperties(tableName),
      request
    );
    return new Promise((resolve, reject) => {
      this.db.run(sql, function (error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`1`);
        console.log(`result: 1`);
      });
    });
  }

  AsyncGet(tableName, request) {
    const sql = ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }

  AsyncExistId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const sql: string = ApiSQLStatements.GetIdExistStatement(
      tableName,
      identityColumn,
      request.params.id
    );
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }

  AsyncGetId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const sql: string = ApiSQLStatements.GetSelectWithIdStatement(
      tableName,
      identityColumn,
      request.params.id
    );
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }

  AsyncCount(tableName, request) {
    const sql = ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }
}
