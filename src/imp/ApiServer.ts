import * as Express from "express";
import * as BodyParser from "body-parser";
import { ApiRouting } from "./ApiRouting";
import { ApiFactoryHandler } from "../db/daoSupport";
import { RunningStatus, Configuration } from "../base/factory";
import { enumRunningStatus } from "../base/enums";
export { ApiRouting } from "./ApiRouting";
export class ApiServer {
  public app: any;
  public status: RunningStatus;
  public lastErrors: any[] = [];
  public routing: ApiRouting;
  public dbHandler: any;

    constructor(private config: Configuration, callback?: { (server): void }) {
    console.log("Starting api server.");
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.app = Express();
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(this.jsonErrorHandler);
    this.status = new RunningStatus(
      enumRunningStatus.Down,
      enumRunningStatus.Down,
      enumRunningStatus.Down
    );

    if (!this.config) console.log("Empty configuration is given!");

    this.status.ApiServer = enumRunningStatus.ApiServerInitializing;
    const api = this.app
      .listen(this.config.listenPort, () => {
        console.log(
          "Server is started at url:" +
          api.address().address +
          " port: " +
          api.address().port
        );
        this.status.ApiServer = enumRunningStatus.ApiServerUp;
      })
      .on("error", function (error) {
        self.lastErrors.push(error);
        if (error.errno === "EADDRINUSE") {
          this.status.apiServer = enumRunningStatus.ApiServerError;
          console.log(`Port ${config.listenPort} is busy`);
        } else {
          console.log(error);
        }
      });

    this.routing = new ApiRouting(this)
    this.dbHandler = ApiFactoryHandler.GetDbApiHandler(this, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonErrorHandler = async (error, request, response, next) => {
    console.log(error);
    this.lastErrors.push(error);
  }

}

