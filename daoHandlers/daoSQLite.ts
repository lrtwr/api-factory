const sqlite3 = require("sqlite3").verbose();
import { ApiSQLStatements } from "../setup/ApiSQLStatements";
import { factory } from "../setup/factory";


export class daoSQLite extends factory.AbstractDaoSupport {
  constructor(
    private server: any,
    private config: any,
    private status: factory.RunningStatus,
    private callback?: { (server): void }
  ) {
    super(status);
    this.AsyncConnect();
  }

  AsyncConnect() {
    const deze = this;
    deze.database = new sqlite3.Database(deze.config.database, error => {
      if (error) {
        deze.status.DbConnect = factory.enumRunningStatus.DbConnectError;
        console.log(error);
      }
    });
    deze.status.DbConnect = factory.enumRunningStatus.DbConnectConnected;
    console.log("Connected to SQLite database: " + deze.config.database);
    var sql = ApiSQLStatements.GetSQLiteTableColumnInfoStatement();

    deze.database.all(sql, (error, result) => {

      deze.tableProperties= new factory.jl.jsonDatabase(result,["table_name","table_type"]);


      // deze.tableProperties= new factory.aObject(result,["table_name","table_type"]);
      // deze.jsonDbTableProp= new factory.jsonDatabase(result,["table_name","table_type"]);
      deze.callback(deze.server);
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
      this.database.run(sql, function(error, result) {
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
      this.database.run(sql, function(error, result) {
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
      this.database.run(sql, function(error, result) {
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
      this.database.all(sql, function(error, rows) {
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
      this.database.all(sql, function(error, rows) {
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
      this.database.all(sql, function(error, rows) {
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
      this.database.all(sql, function(error, rows) {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  }
}
