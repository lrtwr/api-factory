import {jl as _jl} from './jl';

export namespace factory {
  export import jl = _jl;
  // export const GetPropArray = (
  //   oArray: factory.jl.DynamicObject,
  //   propertyName: string
  // ): string[] => {
  //   var ret_value: string[] = [];
  //   oArray.forEach(row => {
  //     if (ret_value.indexOf(row[propertyName]) == -1) {
  //       ret_value.push(row[propertyName]);
  //     }
  //   });
  //   return ret_value;
  // };

  export enum enumApiActions {
    Create,
    Read,
    Update,
    Delete,
    Count,
    Error
  }

  export enum enumDatabaseType {
    MongoDb = "Mongo database",
    SQLite = "SQLite 3",
    SQLiteMemory = "SQLite 3 in Memory",
    MySQL = "MySQL server",
    MSSQL = "Microsoft SQL server"
  }

  export class ApiTools {
    async awaitAndRespond(
      request,
      response,
      promise,
      apiAction: enumApiActions
    ) {
      var id: any;
      if (request.params) {
        if (request.params.id) {
          id = request.params.id;
        }
      }
      const answer = await promise;
      switch (apiAction) {
        case enumApiActions.Error:
          response.status(answer.status);
          break;
        case enumApiActions.Read:
          response.status(200);
          break;
        case enumApiActions.Update:
        case enumApiActions.Create:
        case enumApiActions.Delete:
          response.status(201);
          break;
      }
      const result = new daoResult();
      if (id) result.lastId = id;
      switch (apiAction) {
        case enumApiActions.Error:
          const errResponse: { [k: string]: any } = {};
          errResponse["message"] = answer["message"];
          errResponse["expose"] = answer["expose"];
          errResponse["statusCode"] = answer["statusCode"];
          errResponse["status"] = answer["status"];
          errResponse["body"] = answer["body"];
          errResponse["type"] = answer["type"];
          errResponse["stack"] = answer["stack"];
          result.error = errResponse;
          break;
        case enumApiActions.Read:
          result.rows = answer;
          if (result.rows.length) result.count = result.rows.length;
          break;
        case enumApiActions.Count:
          result.count = answer[0].count;
          break;
        case enumApiActions.Create:
          result.lastId = answer;
          if (result.lastId) result.created = 1;
          result.count = 1;
          break;
        case enumApiActions.Update:
          result.updated = answer[0];
          result.count = answer[0];
          break;
        case enumApiActions.Delete:
          result.deleted = answer[0];
          break;
      }
      result.exists = result.count >= 1 ? 1 : 0;
      response.json(result);
    }
  }

  export abstract class AbstractApiHandler extends ApiTools {
    public dao: any;
    constructor() {
      super();
    }
    public abstract Post(tableName, request, response): any;
    public abstract Get(tableName, request, response): any;
    public abstract GetId(tableName, request, response): any;
    public abstract Put(tableName, request, response): any;
    public abstract PutId(tableName, request, response): any;
    public abstract PatchId(tableName, request, response): any;
    public abstract ExistId(tableName, request, response): any;
    public abstract DeleteId(tableName, request, response): any;
    public abstract GetCount(tableName, request, response): any;
    public abstract Test(tableName, request, response): any;
    public abstract Error(error, request, response): any;
  }

  export abstract class AbstractDaoSupport {
    constructor(status: RunningStatus) {
      status.DbConnect = enumRunningStatus.DbConnectInitializing;
    }
    database: any;
    tableProperties: jl.jsonDatabase;

    public abstract AsyncConnect();
    public abstract AsyncPost(tableNameOrCollection, request): any;
    public abstract AsyncGet(tableNameOrCollection, request): any;
    public abstract AsyncGetId(tableNameOrCollection, request): any;
    public abstract AsyncExistId(tableNameOrCollection, request): any;
    public abstract AsyncPatchId(tableNameOrCollection, request): any;
    public abstract AsyncDeleteId(tableNameOrCollection, request): any;
    public abstract AsyncCount(tableNameOrCollection, request): any;

    public GetColumnProperties(tableName) {
      return this.tableProperties.db.table_name[tableName];
    }

    public GetPrimarayKeyColumnName(tableName) {
      var ret_value:string;
      this.tableProperties.db.table_name[tableName].forEach((column)=>{
        if (column.column_is_pk) {
          ret_value = column.column_name;
        }
      })
      return ret_value;
    }

    public GetTableNames=()=>{
      return this.tableProperties.GetPropArray(this.tableProperties.db.table_type.table,"table_name")
    }
    public GetViewNames=()=>{
      return this.tableProperties.GetPropArray(this.tableProperties.db.table_type.view,"table_name")
    }
  }

  export enum enumRunningStatus {
    Down = "Down",
    Initializing = "Initializing",
    ApiServerInitializing = "ApiServer is initializing",
    DbConnectInitializing = "Database connection is initializing",
    DbConnectConnected = "Database is Connected",
    ApiServerUp = "ApiServer is Up",
    ApiServerError = "ApiServer Error",
    DbConnectError = "Database connection Error",
    UpAndConnected = "Up and Running"
  }

  export class RunningStatus {
    constructor(
      private status: enumRunningStatus,
      private apiServer: enumRunningStatus,
      private dbConnect: enumRunningStatus
    ) {}

    get Status(): enumRunningStatus {
      return this.status;
    }
    set Status(value: enumRunningStatus) {
      this.status = value;
    }
    get ApiServer(): enumRunningStatus {
      return this.apiServer;
    }
    set ApiServer(value: enumRunningStatus) {
      this.apiServer = value;
      if (this.apiServer == enumRunningStatus.ApiServerInitializing) {
        this.status = enumRunningStatus.Initializing;
      }
      if (
        this.apiServer == enumRunningStatus.ApiServerUp &&
        this.dbConnect == enumRunningStatus.DbConnectConnected
      ) {
        this.status = enumRunningStatus.UpAndConnected;
      }
    }

    get DbConnect(): enumRunningStatus {
      return this.dbConnect;
    }

    set DbConnect(value: enumRunningStatus) {
      this.dbConnect = value;
      if (this.dbConnect == enumRunningStatus.DbConnectInitializing) {
        this.status = enumRunningStatus.Initializing;
      }
      if (
        this.apiServer == enumRunningStatus.ApiServerUp &&
        this.dbConnect == enumRunningStatus.DbConnectConnected
      ) {
        this.status = enumRunningStatus.UpAndConnected;
      }
    }
  }

  export class daoResult {
    public exists: number = 0;
    constructor(
      public rows?: Array<any>,
      public updated?: number,
      public deleted?: number,
      public count?: number,
      public created?: number,
      public lastId?: any,
      public error?: any
    ) {
      if (!rows) this.rows = [];
      if (!updated) this.updated = 0;
      if (!deleted) this.deleted = 0;
      if (!count) this.count = 0;
      this.exists = this.count;
      if (!created) this.created = 0;
      if (!lastId) this.lastId = 0;
      if (!error) this.error = {};
    }
  }

  export class Configuration {
    constructor(
      public databaseType?: enumDatabaseType,
      public connectionString?: string,
      public listenPort?: number,
      public database?: string,
      public user?: string,
      public password?: string,
      public host?: string,
      public server?: string
    ) {
      if (connectionString === null)
        connectionString = "Data Source=sqlite.db;Version=3;New=True;";
      if (database === null) database = "Default";
      if (listenPort === null) listenPort = 8000;
      if (databaseType === null) databaseType = enumDatabaseType.SQLite;
    }
  }
}
