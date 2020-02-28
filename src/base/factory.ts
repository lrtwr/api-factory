//import { DynamicObject } from './factory';
import { enumApiActions, enumDatabaseType, enumRunningStatus } from './enums';

// Dynamic object TS
// const a: DynamicObject = {};
// a[ "propname"] = anyValue;
export interface DynamicObject {
  [k: string]: any;
}

// Unused SQLColumnPropertyDefinition
// maybe later
export interface ColumnDef {
  table_name: string,
  column_name: string,
  table_type: string,
  data_type: string,
  column_is_pk: number
}

export class AObject {
  constructor(oArray: any[], aProp?: string[]) {
    if (oArray) {
      if (oArray.length > 0) {
        if (!aProp) aProp = Object.keys(oArray[0]);
        aProp.forEach(prop => {
          if (!this[prop]) this[prop] = {};
          oArray.forEach(obj => {
            if (!this[prop][obj[prop]]) this[prop][obj[prop]] = [];
            this[prop][obj[prop]].push(obj);
          });
        });
      }
    }
  }
  [k: string]: { [k: string]: any[] };
}

export class JsonDatabase {
  public db: AObject;
  constructor(public baseArray: any[], aProp?: string[]) {
    this.db = new AObject(baseArray, aProp);
  }

  public GetPropArray = (
    oArray: DynamicObject,
    propertyName: string
  ): string[] => {
    const ret: string[] = [];
    oArray.forEach(row => {
      if (ret.indexOf(row[propertyName]) == -1) {
        ret.push(row[propertyName]);
      }
    });
    return ret;
  };

  public FindFirstObjWithFilter = (
    firstSel,
    firstSelVal,
    secondSel,
    secondSelVal
  ): any => {
    const objs: any[] = this.db[firstSel][secondSel];
    objs.forEach(column => {
      if (column[secondSel] == secondSelVal) return column;
    });
  };
  public Find(filter: DynamicObject) {
    const ret: any[] = [];
    this.baseArray.forEach(column => {
      let doReturn = 1;
      Object.keys(filter).forEach(prop => {
        if (doReturn) {
          if (column[prop] != filter[prop]) {
            doReturn = 0;
          }
        }
      });
      if (doReturn) ret.push(column);
    });
    return ret;
  }
}

export class DaoResult {
  public rows: Array<any> = [];
  public count = 0;
  public created = 0;
  public updated: number = 0;
  public deleted: number = 0;
  public updatedIds: string[] = [];
  public createdIds: string[] = [];
  public deletedIds: string[] = [];
  public error: any;
  public unUsedBodies: any[] = [];
  public unUsedIds: string[] = [];
  public message = "";

  public method: string = "GET";

  constructor( request?: Request ) {
    if(request) this.method = request.method;
  }

  public exists = () => { this.count > 0 ? 1 : 0 ; }
  
}

export class ApiJsonResponse {
  async awaitAndRespond(
    request,
    response,
    promise,
    apiAction: enumApiActions
  ) {
    let id: any;
    if (request.params) {
      if (request.params.id) {
        id = request.params.id;
      }
    }
    var answer = await promise;
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
    var result : DaoResult;
    if (answer instanceof Array){
      if (answer.length > 0 ) {
        if (answer[0] instanceof DaoResult) { result = answer[0];}
      }
    }
    if (answer instanceof DaoResult ) result = answer;

    if (!result) {
      result = new DaoResult();
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
          if (id) result.createdIds.push(id);
          if (answer instanceof Array) {
            result.createdIds = answer;
            if (result.createdIds) result.created = answer.length;
            result.count = answer.length;
          }
          else {
            result.createdIds.push(answer);
            result.created = result.createdIds.length>0?1:0;
            result.count = 1;
          }
          break;
        case enumApiActions.Update:
          if (id) result.updatedIds.push(id);
          if (answer instanceof Array) {
            result.updatedIds = answer;
            result.count = answer.length;
          }
          else {
            result.updated = answer[0];
            result.count = answer[0];
          }
          break;
        case enumApiActions.Delete:
          result.deleted = answer[0];
          break;
      }
    }
    response.json(result);
  }
}

export class RunningStatus {
  constructor(
    private status: enumRunningStatus,
    private apiServer: enumRunningStatus,
    private dbConnect: enumRunningStatus
  ) { }

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


export class Configuration {
  constructor(
    public databaseType?: enumDatabaseType,
    public connectionString?: string,
    public listenPort?: number,
    public database?: string,
    public user?: string,
    public password?: string,
    public host?: string,
    public server?: string,
    public port?: number
  ) {
    if (connectionString === null)
      connectionString = "Data Source=sqlite.db;Version=3;New=True;";
    if (database === null) database = "Default";
    if (listenPort === null) listenPort = 8000;
    if (databaseType === null) databaseType = enumDatabaseType.SQLite;
  }
}





