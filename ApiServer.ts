import * as Express from "express";
import * as BodyParser from "body-parser";
import { factory } from "./setup/factory";

export { factory } from "./setup/factory";

export class ApiServer {
  public expr: any;
  public app: any;
  public status: factory.RunningStatus;
  public routeList: any[]=[];
  public lastErrors: any[]=[];

  constructor(private config: factory.Configuration) {
    console.log("Starting api server.");
    const self = this;
    this.app = Express();
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(this.jsonErrorHandler);
    //this.app.use(this.app.router); 
    this.status = new factory.RunningStatus(
      factory.enums.enumRunningStatus.Down,
      factory.enums.enumRunningStatus.Down,
      factory.enums.enumRunningStatus.Down
    );

    if (!config) console.log("Empty configuration is given!");
    this.status.ApiServer = factory.enums.enumRunningStatus.ApiServerInitializing;
    const api = this.app
      .listen(config.listenPort, () => {
        console.log(
          "Server is started at url:" +
            api.address().address +
            " port: " +
            api.address().port
        );
        this.status.ApiServer = factory.enums.enumRunningStatus.ApiServerUp;
      })
      .on("error", function(error) {
        self.lastErrors.push(error)
        console.log("foutje!!!!!!!!!!!!!!!!!");
        if (error.errno === "EADDRINUSE") {
          this.status.apiServer = factory.enums.enumRunningStatus.ApiServerError;
          console.log(`Port ${config.listenPort} is busy`);
        } else {
          console.log(error);
        }
      });
    this.Status();
  }
  jsonErrorHandler = async (error, request, response, next) => {
    console.log(error);
    this.lastErrors.push(error);
  }

  public AddRouteList(route: string, routeType: string, tableName: string){
    this.routeList.push({route: route, routeType: routeType, tableName});
  }

  GetStatus(request, response) {
    const conf2 = this.config;
    conf2.password = "********";
    conf2.user = "********";
    const aJson = [];
    aJson.push(this.status);
    aJson.push(conf2);
    aJson.push({"errors":this.lastErrors});
    aJson.push(this.routeList);
    response.json(aJson);
  }

  Status() {
    this.app.use(`/Status`, (req, res) => this.GetStatus(req, res));
  }

  CleanupRoute(tableName, route) {
    if (!route) route = "/" + tableName;
    else {
      if (route.substring(0, 1) != "/") route = "/" + route;
    }
    return route;
  }

}
