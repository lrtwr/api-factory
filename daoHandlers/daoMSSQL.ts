import { ApiServer } from './../ApiServer';
const mssql = require("mssql");
import { ApiSQLStatements } from "../setup/ApiSQLStatements";
import { factory } from "../setup/factory";

export class daoMSSQL extends factory.abstracts.AbstractDaoSupport {
  constructor(
    private server: ApiServer,
    private config: any,
    private status: factory.RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = factory.enums.enumRunningStatus.DbConnectInitializing;
    console.log("connecting");
    this.dbConnect();
  }

    public async dbConnect() {
      console.log("connecting");
  
      try {
        await mssql.connect(this.config);
        this.db = mssql;
        var result = await mssql.query(
          ApiSQLStatements.GetMSSQLTableColumnInfoStatement()
        );
        this.tableProperties= new factory.jl.jsonDatabase(result.recordset,["table_name","table_type"]);
        this.status.DbConnect = factory.enums.enumRunningStatus.DbConnectConnected;
        this.callback(this.server);
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
        (error, result, fields) => {
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
