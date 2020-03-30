import { ResponseDirector } from '../base/responseDirector';
import { DynamicObject } from '../base/custom';
import * as Express from "express";
import { ApiRoutingConfig, AbstractApiRouting, ApiRoutingReadOnly, ApiRoutingReadWrite, ApiRoutingAdmin } from "./ApiRouting";
import { RunningStatus, Configuration } from "../base/custom";
import { enumRunningStatus, enumOperationMode } from "../base/enums";
const os = require("os")
const cluster = require("cluster")

export class ApiServer {
  public app: any;

  public responseDirector: ResponseDirector;
  public status: RunningStatus;
  public lastErrors: any[] = [];
  public routing: AbstractApiRouting;
  public workers: any[] = [];

  constructor(public config: Configuration, private listenPort: number, public callback?: { (error: Error, routing: AbstractApiRouting): void }, multiProcessing:boolean=false) {
    this.status = new RunningStatus(
      enumRunningStatus.Down,
      enumRunningStatus.Down,
      enumRunningStatus.Down
    );

    // start a process cluster
    // one process for every cpu
    
    if (os.cpus().length > 1&&multiProcessing) {
      if (cluster.isMaster) {
        console.log("Starting multiprocessing system.")
        for (let i = 0; i < os.cpus().length; i++) {
          this.workers.push(cluster.fork());
          this.workers[i].on('message', function(message:any) {
            console.log(message);
        });
        }
        cluster.on('online', function (worker: any) {
          //console.log('Worker ' + worker.process.pid + ' is listening');
        });

        // if any of the worker process dies then start a new one by simply forking another one
        cluster.on('exit', function (worker: any, code: any, signal: any) {
          console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
          console.log('Starting a new worker');
          let wrker:any = cluster.fork();
          // to receive messages from worker process
          wrker.on('message', (message: any) => console.log(message));
        });
      } else this.startExpress();
    } else this.startExpress();
  }

  startExpress() {
    var self = this;
    this.app = Express();
    if (!this.config) this.addError(null, "Empty configuration is given!");
    this.status.ApiServer = enumRunningStatus.ApiServerInitializing;
    const app = this.app
      .listen(this.listenPort ?? 6800, () => {
        //console.log(`Express server listening on port ${this.listenPort} with the single worker ${process.pid}`)
        console.log(
          self.config.databaseType +
          "-server is started at url:" +
          app.address().address +
          " port: " +
          app.address().port +
          " process ID: " + process.pid
        );
        //console.log(process.env);
        this.status.ApiServer = enumRunningStatus.ApiServerUp;
      })
      .on("error", function (error: any, appCtx:any) {
        self.lastErrors.push(error);
        if (error.errno === "EADDRINUSE") {
          this.status.apiServer = enumRunningStatus.ApiServerError;
          self.addError(error, "EADDRINUSE: " + this.config.listenPort + "is busy.");
        } else {
          console.error('app error', error.stack);
          console.error('on url', appCtx.req.url);
          console.error('with headers', appCtx.req.headers);
        }
      });

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

