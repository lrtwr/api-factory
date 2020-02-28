import { ApiSQLStatements } from "../base/ApiSQLStatements";
import { AbstractDaoSupport } from "../base/abstracts";
import { RunningStatus, JsonDatabase, DaoResult } from "../base/factory";
import { enumRunningStatus } from "../base/enums";
import * as sqlite3 from 'sqlite3';

sqlite3.verbose();

export class DaoSQLite extends AbstractDaoSupport {
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
    this.db = new sqlite3.Database(self.config.database,sqlite3.OPEN_READWRITE, error => {
      if (error) {
        self.status.DbConnect = enumRunningStatus.DbConnectError;
        console.log(error);
        this.server.lastErrors.push(error);
      }

    });
    // this.db = new sqlite3.Database("./node_modules/apimatic/apitest2.db",sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, error => {
    //   if (error) {
    //     self.status.DbConnect = enumRunningStatus.DbConnectError;
    //     console.log(error);
    //     this.server.lastErrors.push(error);
    //   }
    // });
    this.status.DbConnect = enumRunningStatus.DbConnectConnected;
    console.log("Connected to SQLite database: " + self.config.database);
    const sql = ApiSQLStatements.GetSQLiteTableColumnInfoStatement();
    this.db.all(sql, (error, result) => {
      if (error) {
        this.server.lastErrors.push(error);
      }
      else {
        self.tableProperties = new JsonDatabase(result, ["table_name", "table_type"]);
        self.callback(self.server.routing);
      }
    });
  }



AsyncInsert(answer: DaoResult, sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, function (error) {
        if (error) reject(error);
        answer.createdIds.push(`${this.lastID}`);
        answer.created++;
        answer.count++;
        resolve(answer);
      })
    })
  }

  AsyncUpdate(answer: DaoResult, sql, id) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, function (error) {
        if (error) reject(error);
        answer.updatedIds.push(id);
        answer.updated++;
        answer.count++
        resolve(answer);
      })
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
      this.db.run(sql, function (error) {
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

  AsyncPutId(tableName, request) {
    return this.AsyncPatchId(tableName, request);
  }


  AsyncPatchId(tableName, request) {
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    const sql = ApiSQLStatements.GetUpdateStatement(
      tableName,
      identityColumn,
      this.GetColumnProperties(tableName),
      request
    );
    return this.AsyncUpdate(answer, sql, request.params.id);
  }

  AsyncGet(tableName, request) {
    const sql = ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, result) {
        if (error) {
          reject(error);
        }
        answer.rows = result;
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
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        answer.count=rows;
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
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        answer.rows = rows;
        resolve(answer);
      });
    });
  }

  AsyncCount(tableName, request) {
    const sql = ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      this.db.all(sql, function (error, rows) {
        if (error) {
          reject(error);
        }
        answer.rows=rows;
        resolve(answer);
      });
    });
  }
}
