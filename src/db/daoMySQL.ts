import * as mysql from "mysql";
import { ApiSQLStatements } from "../base/ApiSQLStatements";
import { AbstractDaoSupport } from "../base/abstracts";
import { RunningStatus, JsonDatabase, DaoResult } from "../base/factory";
import { enumRunningStatus } from "../base/enums";


export class DaoMySQL extends AbstractDaoSupport {
  constructor(
    private server: any,
    private config: any,
    private status: RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = enumRunningStatus.DbConnectInitializing;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const db = mysql.createConnection({
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
      const sql = ApiSQLStatements.GetMySQLTableColumnInfoStatement(
        this.config.database
      );
      db.query(sql, (error, result) => {
        if (error) {
          this.server.lastErrors.push(error);
          throw error;
        }
        self.tableProperties = new JsonDatabase(result, [
          "table_name",
          "table_type"
        ]);
        console.log("Connected to MySQL: `" + this.config.database + "`!");
        this.status.DbConnect = enumRunningStatus.DbConnectConnected;
        self.callback(self.server.routing);
      });
    });
  }

  AsyncInsert(answer: DaoResult, sql) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, function (error, result) {
        if (error) {
          reject(error);
        }
        answer.createdIds.push(result.insertId);
        answer.created++;
        answer.count++
        resolve(answer);
      });
    })
  }

  AsyncUpdate(answer: DaoResult, sql, id) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, function (error, result) {
        if (error) {
          reject(error);
        }
        answer.updatedIds.push(id);
        answer.updated++;
        answer.count++
        resolve(answer);
      });
    })
  }

  AsyncDeleteId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    const sql: string = ApiSQLStatements.GetDeleteWithIdStatement(
      tableName,
      identityColumn,
      request.params.id
    );
    return new Promise((resolve, reject) => {
      this.db.query(sql, function(error) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        answer.deleted++;
        answer.deletedIds.push(request.params.id);
        resolve(answer);
      });
    });
  }

  AsyncPutId(tableName, request) {return this.AsyncPatchId(tableName, request)}

  AsyncPatchId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    const sql = ApiSQLStatements.GetUpdateStatement(
      tableName,
      identityColumn,
      this.GetColumnProperties(tableName),
      request
    );
    return new Promise((resolve, reject) => {
      this.db.query(sql, function(error) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        answer.updated++;
        answer.updatedIds.push(request.params.id);
        resolve(answer);
      });
    });
  }

  AsyncGet(tableName, request) {
    const sql = ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        answer.rows = result;
        answer.count= answer.rows.length;
        resolve(answer);
      });
    });
  }

  AsyncExistId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
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
        answer.count=result;
        resolve(answer);
      });
    });
  }

  AsyncGetId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
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
        answer.rows=result;
        answer.count=answer.rows.length;
        resolve(answer);
      });
    });
  }

  AsyncCount(tableName, request) {
    const sql = ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      this.db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        if (result) answer.count =result;
        resolve(answer);
      });
    });
  }
}
