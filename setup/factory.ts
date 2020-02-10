import { jl as _jl } from "./jl";
import { enums as _enums } from "./enums";
import { abstracts as _abstracts } from "./abstracts";

export namespace factory {
  export import jl = _jl;
  export import enums = _enums;
  export import abstracts = _abstracts;

  export class ApiJsonResponse {
    async awaitAndRespond(
      request,
      response,
      promise,
      apiAction: enums.enumApiActions
    ) {
      var id: any;
      if (request.params) {
        if (request.params.id) {
          id = request.params.id;
        }
      }
      const answer = await promise;
      switch (apiAction) {
        case enums.enumApiActions.Error:
          response.status(answer.status);
          break;
        case enums.enumApiActions.Read:
          response.status(200);
          break;
        case enums.enumApiActions.Update:
        case enums.enumApiActions.Create:
        case enums.enumApiActions.Delete:
          response.status(201);
          break;
      }
      const result = new daoResult();
      if (id) result.lastId = id;
      switch (apiAction) {
        case enums.enumApiActions.Error:
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
        case enums.enumApiActions.Read:
          result.rows = answer;
          if (result.rows.length) result.count = result.rows.length;
          break;
        case enums.enumApiActions.Count:
          result.count = answer[0].count;
          break;
        case enums.enumApiActions.Create:
          result.lastId = answer;
          if (result.lastId) result.created = 1;
          result.count = 1;
          break;
        case enums.enumApiActions.Update:
          result.updated = answer[0];
          result.count = answer[0];
          break;
        case enums.enumApiActions.Delete:
          result.deleted = answer[0];
          break;
      }
      result.exists = result.count >= 1 ? 1 : 0;
      response.json(result);
    }
  }

  export class RunningStatus {
    constructor(
      private status: enums.enumRunningStatus,
      private apiServer: enums.enumRunningStatus,
      private dbConnect: enums.enumRunningStatus
    ) {}

    get Status(): enums.enumRunningStatus {
      return this.status;
    }
    set Status(value: enums.enumRunningStatus) {
      this.status = value;
    }
    get ApiServer(): enums.enumRunningStatus {
      return this.apiServer;
    }
    set ApiServer(value: enums.enumRunningStatus) {
      this.apiServer = value;
      if (this.apiServer == enums.enumRunningStatus.ApiServerInitializing) {
        this.status = enums.enumRunningStatus.Initializing;
      }
      if (
        this.apiServer == enums.enumRunningStatus.ApiServerUp &&
        this.dbConnect == enums.enumRunningStatus.DbConnectConnected
      ) {
        this.status = enums.enumRunningStatus.UpAndConnected;
      }
    }

    get DbConnect(): enums.enumRunningStatus {
      return this.dbConnect;
    }

    set DbConnect(value: enums.enumRunningStatus) {
      this.dbConnect = value;
      if (this.dbConnect == enums.enumRunningStatus.DbConnectInitializing) {
        this.status = enums.enumRunningStatus.Initializing;
      }
      if (
        this.apiServer == enums.enumRunningStatus.ApiServerUp &&
        this.dbConnect == enums.enumRunningStatus.DbConnectConnected
      ) {
        this.status = enums.enumRunningStatus.UpAndConnected;
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
      public databaseType?: enums.enumDatabaseType,
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
      if (databaseType === null) databaseType = enums.enumDatabaseType.SQLite;
    }
  }
}
