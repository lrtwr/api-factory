import { enumApiActions, enumDatabaseType, enumRunningStatus } from './enums';

export interface DynamicObject {
  [k: string]: any;
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
  public exists = 0;
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
    const result = new DaoResult();
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





