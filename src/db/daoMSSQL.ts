import { ApiServer } from '../imp/ApiServer';
import { ApiSQLStatements } from "../base/ApiSQLStatements";
import * as mssql  from 'mssql'
import { enumRunningStatus } from '../base/enums';
import { AbstractDaoSupport } from '../base/abstracts';
import { RunningStatus, JsonDatabase } from '../base/factory';



export class DaoMSSQL extends AbstractDaoSupport {
  constructor(
    private server: ApiServer,
    private config: any,
    private status: RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = enumRunningStatus.DbConnectInitializing;
    console.log("connecting");
    this.dbConnect();
  }

    public async dbConnect() {
      try {
        await mssql.connect(this.config);
        this.db = mssql;
        const result = await mssql.query(
          ApiSQLStatements.GetMSSQLTableColumnInfoStatement()
        );
        this.tableProperties= new JsonDatabase(result.recordset,["table_name","table_type"]);
        this.status.DbConnect = enumRunningStatus.DbConnectConnected;
        console.log("Connected to MSSQL: `" + this.config.database + "`!");
        this.callback(this.server.routing);
      } catch (error) {
        this.server.lastErrors.push(error);
      }
    }

  AsyncPost(tableName, request) {
    const sql = ApiSQLStatements.GetInsertStatement(
      tableName,
      this.GetColumnProperties(tableName),
      request
    );
    return new Promise((resolve, reject) => {
      this.db.query(
        sql + ";SELECT SCOPE_IDENTITY() as LastID;",
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(result.recordset[0].LastID);
          console.log(result.recordset[0]);
        }
      );
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
        resolve(result.rowsAffected);
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
        resolve(result.rowsAffected);
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
        if (result) resolve(result.recordset);
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
        if (result) resolve(result.recordset);
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
        if (result) resolve(result.recordset);
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
        if (result) resolve(result.recordset);
      });
    });
  }
}
