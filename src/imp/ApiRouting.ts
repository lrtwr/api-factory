import { Configuration } from './../base/factory';
import { Express } from 'express';
import { enumDatabaseType } from '../base/enums';

export class ApiRouting {
  public app: Express;
  public routeList: any[] = [];
  config: Configuration
  constructor(private server) {
    this.app = this.server.app;
    this.config = this.server.config;
    this.app.use(`/Status`, (req, res) => this.GetStatus(res));
    if (this.config.databaseType != enumDatabaseType.MongoDb) {
      this.app.use(`/Models`, (req, res) => res.json(this.server.dbHandler.dao.GetModels()));
      this.AddRouteList("/Models", "*", "Database Model Definition.");
      this.app.use(`/ColumnProperties`, (req, res) => res.json(this.server.dbHandler.dao.tableProperties.baseArray));
      this.AddRouteList("/ColumnProperties", "*", "Database Column Definition.");
    }
  }

  FinalizeRouting() {
    this.app.use(`*`, (req, res) =>
      this.server.dbHandler.Error({
        body: req.body,
        expose: true,
        message: "Unhandled route. See /status for usable routing.",
        stack: "No internal api-server error.",
        status: 404,
        statusCode: 404,
        type: "route error"
      }, req, res)
    );
  }

  GetStatus(response) {
    const conf2 = this.server.config;
    conf2.password = "********";
    conf2.user = "********";
    const aJson = [];
    aJson.push(this.server.status);
    aJson.push(conf2);
    aJson.push({ "errors": this.server.lastErrors });
    aJson.push(this.routeList);
    response.json(aJson);
  }

  AllTablesApis() {
    const tableNames: string[] = this.server.dbHandler.dao.GetTableNames();
    tableNames.forEach((name) => {
      this.TableApis(name);
    })
    const viewNames: string[] = this.server.dbHandler.dao.GetViewNames();
    viewNames.forEach((name) => {
      this.ReadViewApis(name);
    })
  }

  TableApis(tableName, route?) {
    this.ReadTableApis(tableName, route);
    this.Post(tableName, route);
    this.Put(tableName, route);
    this.Patch(tableName, route);
    this.PutId(tableName, route);
    this.PatchId(tableName, route);
    this.DeleteId(tableName, route);
  }

  ReadTableApis(tableName, route?) {
    this.Count(tableName, route);
    this.ExistId(tableName, route);
    this.Get(tableName, route);
    this.GetId(tableName, route);
  }

  ReadViewApis(viewName, route?) {
    this.Count(viewName, route);
    this.Get(viewName, route);
  }

  Get(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "Get", tableName);
    this.app.get(`${route}`, (req, res) =>
      this.server.dbHandler.Get(tableName, req, res)
    );
  }

  GetId(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "GetId", tableName);
    this.app.get(`${route}/:id`, (req, res) =>
      this.server.dbHandler.GetId(tableName, req, res)
    );
  }

  PutId(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "PutId", tableName);
    this.app.put(`${route}/:id`, (req, res) =>
      this.server.dbHandler.PutId(tableName, req, res)
    );
  }

  Post(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "Post", tableName);
    this.app.post(`${route}`, (req, res) =>
      this.server.dbHandler.Post(tableName, req, res)
    );
  }

  Patch(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "Patch", tableName);
    this.app.patch(`${route}`, (req, res) =>
      this.server.dbHandler.Patch(tableName, req, res)
    );
  }

  Put(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "Put", tableName);
    this.app.put(`${route}`, (req, res) =>
      this.server.dbHandler.Put(tableName, req, res)
    );
  }

  PatchId(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "PatchId", tableName);
    this.app.patch(`${route}/:id`, (req, res) =>
      this.server.dbHandler.PatchId(tableName, req, res)
    );
  }

  DeleteId(tableName, route?) {
    route = this.CleanupRoute(tableName, route);
    this.AddRouteList(route, "DeleteId", tableName);
    this.app.delete(`${route}/:id`, (req, res) =>
      this.server.dbHandler.DeleteId(tableName, req, res)
    );
  }

  ExistId(tableName, route?) {
    route = this.CleanupRoute(tableName, route) + '-exist';
    this.AddRouteList(route, "ExistId", tableName);
    this.app.get(`${route}/:id`, (req, res) =>
      this.server.dbHandler.ExistId(tableName, req, res)
    );
  }

  Count(tableName, route?) {
    route = this.CleanupRoute(tableName, route) + "-count";
    this.AddRouteList(route, "Count", tableName);
    this.app.get(`${route}`, (req, res) =>
      this.server.dbHandler.GetCount(tableName, req, res)
    );
  }

  AddRouteList(route: string, routeType: string, tableName: string) {
    this.routeList.push({ route: route, routeType: routeType, tableName });
  }

  CleanupRoute(tableName, route) {
    if (!route) route = "/" + tableName;
    else {
      if (route.substring(0, 1) != "/") route = "/" + route;
    }
    return route;
  }
}
