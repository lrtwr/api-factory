
import { RequestInfo } from './requestInfo';
import { enumApiActions, enumDatabaseType, enumRunningStatus, enumOperationMode } from './enums';

export interface DynamicObject {[k: string]: any;}

export const CloneObjectInfo = (fromObj: {[k: string]: any;}, toObj: {[k: string]: any;}) => {
  Object.keys(fromObj).forEach(key => {
    toObj[key] = fromObj[key];
  });
}


// Jeroen: Bruikbaar?
export interface IDisposable {
  dispose(): Promise<void>;
}
export async function asyncUsing<T extends IDisposable>(resource: T, func: (resource: T) => Promise<void>) {
  try {
      await func(resource);
  } finally {
      await resource.dispose();
  }
}

export function using<T extends IDisposable>(resource: T, func: (resource: T) => void) {
  try {
      func(resource);
  } finally {
      resource.dispose();
  }
}
///eind

export class JsonResult {
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
  public method: string = "";
  public processId: any;

  constructor(requestInfo: RequestInfo, public message: string="") {
    this.method = requestInfo.method;
    this.processId = process.pid;
  }
  // jeroen exist nog toevoegen aan result.json object

  public get exists () { return this.count > 0 ? 1 : 0; }
}

export class ApiJsonResponse {
  async awaitAndRespond(
    requestInfo: RequestInfo,
    response: any,
    promise: Promise<any>,
    apiAction: enumApiActions
  ) {
    var answer
    try {
      answer = await promise;
    } catch (error) {
      let newanswer = new JsonResult(requestInfo);
      //cloneObjectInfo(answer,newanswer);
      newanswer.error = error;
      answer = newanswer;
    }

 
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
      case enumApiActions.System:
        if(!answer.message)answer.message="";
        break;
    }
    var result: JsonResult;
    if (answer instanceof Array) {
      if (answer.length > 0) if (answer[0] instanceof JsonResult) result = answer[0]; 
    }
    if (answer instanceof JsonResult) result = answer;
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
    public authKey?: string,        //cosmos
    public databaseId?: string,     //cosmos
    public collectionId?: string,   //cosmos
    public connectionString?: string,     //cosmos
    public database?: string,
    public user?: string,
    public password?: string,
    public host?: string,
    public server?: string,
    public port?: number,
    public operationMode?: enumOperationMode 
  ) {
    if (connectionString === null)
      connectionString = "Data Source=sqlite.db;Version=3;New=True;";
    if (database === null) database = "Default";
    if (databaseType === null) databaseType = enumDatabaseType.SQLite;
  }

  public get isSql() : boolean {
    return this.databaseType==enumDatabaseType.MSSQL || this.databaseType==enumDatabaseType.MySQL || this.databaseType==enumDatabaseType.SQLite || this.databaseType==enumDatabaseType.SQLiteMemory;
  }
}





