import * as Express from "express";
import * as BodyParser from "body-parser";
import { factory } from "./setup/factory";

export { factory } from "./setup/factory";

export class ApiServer {
  public expr: any;
  public app: any;
  public status: factory.RunningStatus;
  public routeList: any[]=[];

  constructor(private config: factory.Configuration) {
    console.log("Starting api server.");
    this.app = Express();
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
    //this.app.use(this.app.router); 
    this.status = new factory.RunningStatus(
      factory.enumRunningStatus.Down,
      factory.enumRunningStatus.Down,
      factory.enumRunningStatus.Down
    );

    if (!config) console.log("Empty configuration is given!");
    this.status.ApiServer = factory.enumRunningStatus.ApiServerInitializing;
    const api = this.app
      .listen(config.listenPort, () => {
        console.log(
          "Server is started at url:" +
            api.address().address +
            " port: " +
            api.address().port
        );
        this.status.ApiServer = factory.enumRunningStatus.ApiServerUp;
      })
      .on("error", function(err) {
        console.log("foutje!!!!!!!!!!!!!!!!!");
        if (err.errno === "EADDRINUSE") {
          this.status.apiServer = factory.enumRunningStatus.ApiServerError;
          console.log(`Port ${config.listenPort} is busy`);
        } else {
          console.log(err);
        }
      });
    this.Status();
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
