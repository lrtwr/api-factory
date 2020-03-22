import { RequestInfo } from '../base/RequestInfo';
import { ApiServer } from '../imp/ApiServer';
import { enumRunningStatus } from '../base/enums';
import { AbstractDao, IDaoBasic } from './AbstractDao';
import { RunningStatus, JsonDatabase, Configuration } from '../base/custom';
import { MSSQLStatements } from '../sql/MSSQLStatements';
import { AbstractApiRouting } from '../imp/ApiRouting';

const mssql = require('mssql')
export class DaoMSSQL  extends AbstractDao implements IDaoBasic {
  executeSql = (sql:string, callback:any) => this.db.query(sql, callback);

  public config: Configuration;
  public status: RunningStatus;
  constructor(
    public server: ApiServer,
    public callback?: { (error: Error, routing:AbstractApiRouting): void }
  ) {
    super();
    this.config = server.config;
    this.status = server.status;
    this.sqlStatements = new MSSQLStatements();;
  }

  public async connect() {
    var self = this;
    this.db = mssql;
    await mssql.on('error', (error:Error) => {
      self.server.addError(error);
    })
    await mssql.connect(this.config, (error:Error) => {
      if (error) self.server.addError(error);
      else {
      }
      this.getDbInfo((error: Error, result:any) => {
        if (error) {
          self.server.addError(error);
          self.callback(error,null);
        }
        if (result) {
          if (result == "1") {
            self.callback(null,self.server.routing);
            this.status.DbConnect = enumRunningStatus.DbConnectConnected;
            console.log("Connected to MSSQL: `" + this.config.database + "`!");
          }
        }
      })
    });
  }

  getDbInfo(callback?:any) {
    const sql:string = this.sqlStatements.GetTableColumnInfoStatement();
    const self = this;
    this.executeSql(sql, (error:Error, result:any) => {
      if (error) callback(error);
      if (result) {
        result.recordset.forEach((row:any) => { row.table_name = row.table_name.toLowerCase() })
        self.tableProperties = new JsonDatabase(result.recordset, [
          "table_name",
          "table_type"
        ]);
      }
      if (callback) callback(null, "1");
    });
  }

  createTable(requestInfo: RequestInfo, callback: any) {
    const sql = this.sqlStatements.CreateTable(requestInfo);
    this.executeSql(sql, (error:Error,result:any) => {
      if (error) callback(error);
      this.getDbInfo((error:Error) => {
        if (error) callback(error)
        else {
          const tableProp = this.columnProperties(requestInfo);
          callback(null, tableProp != null);
        }
      })
    })
  }

  deleteTable(requestInfo: RequestInfo, callback: any) {
      const sql = this.sqlStatements.DeleteTable(requestInfo);
      this.executeSql(sql, (error:Error) => {
        if (error) callback(error);
        this.getDbInfo((error:Error) => {
          if (error) callback(error)
          else {
            const tableProp = this.columnProperties(requestInfo);
            callback(null, tableProp == null);
          }
        })
      })
  }

  createColumn(requestInfo: RequestInfo, callback: any) {
    let tableProp = this.models();
    if (tableProp[requestInfo.tableName][requestInfo.columnName]) callback(null, "Column '" + requestInfo.columnName + " from table " + (requestInfo.tableName) + "' already exists.");
    else {
      const sql = this.sqlStatements.CreateColumn(requestInfo);
      this.executeSql(sql, (error:Error,result:any) => {
        if (error) callback(error);
        this.getDbInfo((error:Error,result:any) => {
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
    if (!columnProp) callback(null, "Table '" + (requestInfo.tableName) + "' does not exists.");
    else {
      requestInfo.dataType = columnProp[0].data_type;
      return this.createColumn(requestInfo, (error:Error,result:any) => {
        callback(error,result);
      });
    }
  }

  async getAllItems( requestInfo: RequestInfo, callback:any) {
    const sql = this.sqlStatements.GetSelectFromRequestInfo( requestInfo);
    this.executeSql(sql, (error:Error,result:any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset);
    });
  }

  async getItem(requestInfo:RequestInfo, itemId:any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetSelectWithIdStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.executeSql(sql, (error:Error,result:any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset);
    });
  }

  async countItems( requestInfo: RequestInfo, callback:any) {
    const sql = this.sqlStatements.GetCountSelectRequestInfo(requestInfo);
    this.executeSql(sql, (error:Error,result:any) => {
      if (error) callback(error);
      if (result) callback(null, result.recordset.length);
      callback(null, 0);
    });
  }

  async addItem(requestInfo: RequestInfo, body:{[k:string]:any}, callback:any) {
    const columnProperties = this.columnProperties(requestInfo);
    let sql = this.sqlStatements.GetInsertStatement(
      requestInfo,
      body,
      columnProperties,
      "[", "]"
    );
    this.executeSql(sql, function (error:Error,result:any) {
      callback(error, result.recordset);
    })
  }

  async updateItem(requestInfo:RequestInfo, id: any, body:{[k:string]:any}, callback:any) {
    const columnProperties = this.columnProperties(requestInfo);
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    let sql = this.sqlStatements.GetUpdateFromBodyStatement(
      requestInfo,
      id,
      identityColumn,
      columnProperties,
      body
    );
    this.executeSql(sql, function (error:Error,result:any) {
      callback(error, requestInfo.id);
      // if (error) callback(error);
      // if (result) callback(null, id);
    })
  }

  itemExists(requestInfo:RequestInfo, itemId: any, callback: any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetIdExistStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.db.query(sql, (error:Error,result:any) => {
      if (error) callback(error);
      if (result) callback(result.recordset);
    });
  }

  async deleteItem(requestInfo:RequestInfo, itemId:any, callback:any) {
    const identityColumn = this.primaryKeyColumnName(requestInfo);
    const sql: string = this.sqlStatements.GetDeleteWithIdStatement(
      requestInfo,
      identityColumn,
      itemId
    );
    this.db.query(sql, function (error:Error, result:any) {
      if (error) callback(error);
      if (result) callback(null, result.rowsAffected);
    });
  }
}