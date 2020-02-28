import { ApiServer } from '../imp/ApiServer';
import { ApiSQLStatements } from "../base/ApiSQLStatements";
import * as mssql from 'mssql'
import { enumRunningStatus } from '../base/enums';
import { AbstractDaoSupport } from '../base/abstracts';
import { RunningStatus, JsonDatabase, DaoResult } from '../base/factory';

export class DaoMSSQL extends AbstractDaoSupport {
  constructor(
    private server: ApiServer,
    private config: any,
    private status: RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = enumRunningStatus.DbConnectInitializing;
    this.dbConnect();
  }

  public async dbConnect() {
    try {
      await mssql.connect(this.config);
      this.db = mssql;
      const result = await mssql.query(
        ApiSQLStatements.GetMSSQLTableColumnInfoStatement()
      );
      this.tableProperties = new JsonDatabase(result.recordset, ["table_name", "table_type"]);
      this.status.DbConnect = enumRunningStatus.DbConnectConnected;
      console.log("Connected to MSSQL: `" + this.config.database + "`!");
      this.callback(this.server.routing);
    } catch (error) {
      this.server.lastErrors.push(error);
    }
  }


  AsyncInsert(answer: DaoResult, sql) {
    return new Promise((resolve, reject) => {
      this.db.query(sql + ";SELECT SCOPE_IDENTITY() as LastID;", function (error, result) {
        if (error) {
          reject(error);
        }
        answer.createdIds.push(result.recordset[0].LastID);
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
      this.db.query(sql, function (error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        answer.deleted = result.rowsAffected;
        resolve(answer);
      });
    });
  }

  AsyncPutId(tableName, request) { return this.AsyncPatchId(tableName, request) }

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
      this.db.query(sql, function (error, result) {
        if (error) {
          console.log(error.message);
          reject(error);
        }
        answer.updated = result.rowsAffected;
        answer.unUsedIds.push(request.params.id);
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
        if (result) {
          answer.rows = result.recordset;
          answer.count = answer.rows.length;
        }
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
        if (result) answer.rows = result.recordset;
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
        if (result) {
          answer.rows=result.recordset;
          answer.count=answer.rows.length;
        }
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
        if (result) {
          answer.count=result.recordset;
        }
        resolve(answer);
      });
    });
  }
}
