import { ApiFactoryHandler } from "./daoSupport";
const mysql = require("mysql");
import { ApiSQLStatements } from "../setup/ApiSQLStatements";
import { factory } from "../setup/factory";

export class daoMySQL extends factory.abstracts.AbstractDaoSupport {
  constructor(
    private server: any,
    private config: any,
    private status: factory.RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = factory.enums.enumRunningStatus.DbConnectInitializing;

 
    const self = this;
    var db = mysql.createConnection({
      host: this.config.host,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      port: this.config.port
    });
    this.db = db;
    db.connect(error => {
      if (error) {
        this.server.lastErrors.push(error);
        throw error;
      }
      var sql = ApiSQLStatements.GetMySQLTableColumnInfoStatement(
        this.config.database
      );
      db.query(sql, (error, result) => {
        if (error) {
          this.server.lastErrors.push(error);
          throw error;
        }
        self.tableProperties = new factory.jl.jsonDatabase(result, [
          "table_name",
          "table_type"
        ]);
        console.log("Connected to MySQL: `" + this.config.database + "`!");
        this.status.DbConnect = factory.enums.enumRunningStatus.DbConnectConnected;
        self.callback(self.server);
      });
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
      this.db.query(sql, function(error, result, fields) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`${result.insertId}`);
        console.log(`lastID ${result.insertId}`);
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
      this.db.query(sql, function(error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`1`);
        console.log(`1 updated`);
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
      this.db.query(sql, function(error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        resolve(`1`);
        console.log(`1 updated`);
      });
    });
  }

  AsyncGet(tableName, request) {
    const sql = ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
    return new Promise((resolve, reject) => {
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
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
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
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
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  AsyncCount(tableName, request) {
    const sql = ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
    return new Promise((resolve, reject) => {
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        if (result) resolve(result);
      });
    });
  }
}
