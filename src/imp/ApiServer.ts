import * as Express from "express";
import * as BodyParser from "body-parser";
import { ApiRouting } from "./ApiRouting";
import { ApiFactoryHandler } from "../db/daoSupport";
import { RunningStatus, Configuration } from "../base/factory";
import { enumRunningStatus } from "../base/enums";
export { ApiRouting } from "./ApiRouting";
// const cors = require('cors');
// const helmet = require('helmet');
// const jwt = require('express-jwt');
// const jwtAuthz = require('express-jwt-authz');

var jwks = require('jwks-rsa');

//npm install --save express-jwt jwks-rsa express-jwt-authz
// const checkJwt = jwt({
//     secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: 'https://dev-x90ce4d0.eu.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'https://localhost:6800',
//   issuer: 'https://dev-x90ce4d0.eu.auth0.com/',
//   algorithms: ['RS256']
// });
export class ApiServer {
  public app: any;
  public status: RunningStatus;
  public lastErrors: any[] = [];
  public routing: ApiRouting;
  public dbHandler: any;
  //ads = [ {title: 'Hello, world (again)!'} ];
    constructor(private config: Configuration, callback?: { (server): void }) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.app = Express();
    // this.app.use(helmet());
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(this.jsonErrorHandler);
    // this.app.use(cors());
    // this.app.use(checkJwt);
    this.status = new RunningStatus(
      enumRunningStatus.Down,
      enumRunningStatus.Down,
      enumRunningStatus.Down
    );

    if (!this.config){ 
      console.log("Empty configuration is given!");
    }

    this.status.ApiServer = enumRunningStatus.ApiServerInitializing;
    const api = this.app
      .listen(this.config.listenPort, () => {
        console.log( this.config.databaseType.toString() + 
          " is started at port:" +
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
    // this.app.get('/ads', (req, res) => {
    //   res.send(this.ads);
    // });
  //   this.app.get('/authorized',checkJwt, function (req, res) {
  //     res.send('Secured Resource');
  // });
    this.routing = new ApiRouting(this)
    this.dbHandler = ApiFactoryHandler.GetDbApiHandler(this, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonErrorHandler = async (error, request, response, next) => {
    console.log(error);
    this.lastErrors.push(error);
  }

}

