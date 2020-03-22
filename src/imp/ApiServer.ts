import { ResponseDirector } from './../base/ResponseDirector';
import { DynamicObject } from '../base/custom';
import * as Express from "express";
import { ApiRoutingConfig, AbstractApiRouting, ApiRoutingReadOnly, ApiRoutingReadWrite, ApiRoutingAdmin } from "./ApiRouting";
import { RunningStatus, Configuration } from "../base/custom";
import { enumRunningStatus, enumOperationMode } from "../base/enums";

export class ApiServer {
  public app: any;

  public responseDirector: ResponseDirector;
  public status: RunningStatus;
  public lastErrors: any[] = [];
  public routing: AbstractApiRouting;

  constructor(public config: Configuration, private listenPort:number, public callback?: { (error: Error, routing: AbstractApiRouting): void }) {
    this.status = new RunningStatus(
      enumRunningStatus.Down,
      enumRunningStatus.Down,
      enumRunningStatus.Down
    );
    
    this.app = Express();
    var self = this;
    if (!this.config) this.addError(null,"Empty configuration is given!" );
    if (this.listenPort == null) this.listenPort = 6800;
    this.status.ApiServer = enumRunningStatus.ApiServerInitializing;
    const api = this.app
      .listen(this.listenPort, () => {
        console.log(
          self.config.databaseType +
          "-server is started at url:" +
          api.address().address +
          " port: " +
          api.address().port
        );
        console.log(process.env);
        console.log(process.env.PORT);
        this.status.ApiServer = enumRunningStatus.ApiServerUp;
      })
      .on("error", function (error: any) {
        self.lastErrors.push(error);
        if (error.errno === "EADDRINUSE") {
          this.status.apiServer = enumRunningStatus.ApiServerError;
          self.addError(error, "EADDRINUSE: " + this.config.listenPort + "is busy." );
        } else {
          self.addError( error, "Connection error." )
        }
      });

    //this.routing = new ApiRoutingConfig(this);
    switch (this.config.operationMode) {
      case enumOperationMode.ReadOnly:
        this.routing = new ApiRoutingReadOnly(this);
        break;
      case enumOperationMode.ReadWrite:
        this.routing = new ApiRoutingReadWrite(this);
        break;
      case enumOperationMode.Admin:
        this.routing = new ApiRoutingAdmin(this);
        break;
      default:
        this.routing = new ApiRoutingConfig(this);
        break;
    }
    this.responseDirector = new ResponseDirector(this);
  }

  addError(errorObject: Error, message?: string) {
    const newErrorObj: DynamicObject = {};
      newErrorObj["error"] = errorObject;
      newErrorObj.message = errorObject.message;
   if (message) newErrorObj["message"] = message;
    this.lastErrors.push({ newErrorObj });
    console.log(errorObject);
  }
}

