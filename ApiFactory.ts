import { Express } from 'express';
import { factory } from "./setup/factory";
import { ApiServer } from "./ApiServer"
import { ApiFactoryHandler } from "./daoHandlers/daoSupport"

export { factory } from "./setup/factory";

export class ApiRouting {
  public handler: factory.abstracts.AbstractApiHandler;
  public server: ApiServer;
  public app: Express;

  constructor(config: factory.Configuration, callback?: { (server): void }) {
    this.server = new ApiServer(config);
    this.app = this.server.app;
    if (!callback) callback = (server) => {
      server.AllTablesApis();
      server.FinalizeRouting();
    };
    this.app.use(this.jsonErrorHandler);
    this.handler = ApiFactoryHandler.GetDbApiHandler(this, config, this.server.status, callback);
  }

  jsonErrorHandler = async (error, request, response, next) => {
    console.log(error);
    this.handler.Error(error, request, response)
  }
  FinalizeRouting() {
    this.app.use(`*`, (req, res) =>
      this.handler.Error({
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
  AllTablesApis() {
    const deze = this;
    const tableNames: string[] = this.handler.dao.GetTableNames();
    tableNames.forEach((name) => {
      this.TableApis(name);
    })
    const viewNames: string[] = this.handler.dao.GetViewNames();
    viewNames.forEach((name) => {
      this.ReadViewApis(name);
    })
  }

  TableApis(tableName, route?) {
    this.Post(tableName, route);
    this.Put(tableName, route);
    this.PutId(tableName, route);
    this.PatchId(tableName, route);
    this.DeleteId(tableName, route);
    this.ReadTableApis(tableName, route);
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
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "Get", tableName);
    this.app.get(`${route}`, (req, res) =>
      this.handler.Get(tableName, req, res)
    );
  }

  GetId(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "GetId", tableName);
    this.app.get(`${route}/:id`, (req, res) =>
      this.handler.GetId(tableName, req, res)
    );
  }

  Put(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "Put", tableName);
    this.app.put(`${route}`, (req, res) =>
      this.handler.Put(tableName, req, res)
    );
  }

  PutId(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "PutId", tableName);
    this.app.put(`${route}/:id`, (req, res) =>
      this.handler.PutId(tableName, req, res)
    );
  }

  Post(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "Post", tableName);
    this.app.post(`${route}`, (req, res) =>
      this.handler.Post(tableName, req, res)
    );
  }

  PatchId(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "PatchId", tableName);
    this.app.patch(`${route}/:id`, (req, res) =>
      this.handler.PatchId(tableName, req, res)
    );
  }

  DeleteId(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route);
    this.server.AddRouteList(route, "DeleteId", tableName);
    this.app.delete(`${route}/:id`, (req, res) =>
      this.handler.DeleteId(tableName, req, res)
    );
  }

  ExistId(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route) + '-exist';
    this.server.AddRouteList(route, "ExistId", tableName);
    this.app.get(`${route}/:id`, (req, res) =>
      this.handler.ExistId(tableName, req, res)
    );
  }

  Count(tableName, route?) {
    route = this.server.CleanupRoute(tableName, route) + "-count";
    this.server.AddRouteList(route, "Count", tableName);
    this.app.get(`${route}`, (req, res) =>
      this.handler.GetCount(tableName, req, res)
    );
  }
}

