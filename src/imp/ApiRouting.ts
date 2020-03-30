import { DynamicObject } from './../base/custom';
import { ApiServer } from './ApiServer';
import { Configuration } from '../base/custom';
import * as BodyParser from "body-parser";
import * as Morgan from 'morgan'

export abstract class AbstractApiRouting {
  public app: any;
  public routeList: any[] = [];
  config: Configuration
  constructor(public server: ApiServer) {
    this.app = this.server.app;
    this.config = this.server.config;
    this.app.use(BodyParser.json());
    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(this.jsonErrorHandler);
    this.app.disable('x-powered-by');
    this.app.use(`/Status`, (req:any, res:any) => this.status(res));
    //this.app.use( Morgan(':method :url :status :res[content-length] - :response-time ms'))
    //this.app.use(Morgan(':remote-addr - :remote-user ":method :url " :status :res[content-length] ":referrer" ":user-agent"'))
    this.app.use(`/Environment`, (req:any, res:any) => this.environment(res));
    this.app.use(Morgan('tiny'));

    // this.app.use(Morgan(function (tokens, req, res) {
    //   return [
    //     tokens.method(req, res),
    //     tokens.url(req, res),
    //     tokens.status(req, res),
    //     tokens.res(req, res, 'content-length'), '-',
    //     tokens['response-time'](req, res), 'ms'
    //   ].join(' ')+" ProcessId:" +process.pid
    // }))


    }
 


  jsonErrorHandler = async (error:any, request:any, response:any, next:any) => {
    this.server.addError( error,  "Express error." );
  }
  abstract allTablesApis():any;
  abstract finalizeRouting():any;

  systemApis() {
    this.createTable();
    this.deleteTable();
    this.createColumn();
    this.createForeignKey();
    this.app.use(`/system/TableNames`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.tableNames()));
    this.addRouteList("/system/TableNames", "*", "Database tablenames.");
    this.app.use(`/system/ViewNames`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.viewNames()));
    this.addRouteList("/system/ViewNames", "*", "Database viewnames.");
    this.app.use(`/system/ModelInfo/:id`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.models(req.params.id)));
    this.addRouteList("/system/ModelInfo", "*/tableName", "Database Model Definition id: tablename");
    this.app.use(`/system/ModelInfo`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.models()));
    this.addRouteList("/system/ModelInfo", "*", "Database Model Definition.");
    this.addRouteList(`/system/ColumnInfo/:id`, "*/tableName", "Column properties id: tablename");
    this.app.use(`/system/ColumnInfo/:id`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.columnProperties(req.params.id)));
    this.app.use(`/system/ColumnInfo`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.dbInfo.baseArray));
    this.addRouteList("/system/ColumnInfo", "*/tableName", "Database Column Definition.");
    this.app.use(`/system/PrimaryKeys/:id`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.primaryKeys(req.params.id)));
    this.addRouteList("/system/PrimaryKeys/:id", "*/tableName", "Get PrimaryKey id: tablename");
    this.app.use(`/system/PrimaryKeys`, (req:any, res:any) => res.json(this.server.responseDirector.apiDb.dao.primaryKeys()));
    this.addRouteList("/system/PrimaryKeys", "*/tableName", "Get PrimaryKey id: tablename")
  }

  environment(response:any){
    const ret: DynamicObject={};
    Object.keys(process.env).forEach((key)=>{
      ret[key] = process.env[key];
    })
    ret["Process ID"]= process.pid;
    response.json(ret);
  }
  status(response:any) {
    const conf2 = this.server.config;
    conf2.password = "********";
    conf2.user = "********";
    const aJson = [];
    aJson.push(this.server.status);
    aJson.push(conf2);
    aJson.push("Process ID: " + process.pid);
    aJson.push({ "errors": this.server.lastErrors });
    aJson.push(this.routeList);
    response.json(aJson);
  }
  cleanupRoute(tableName:string, route:string) {
    if (!route) route = "/" + tableName;
    else {
      if (route.substring(0, 1) != "/") route = "/" + route;
    }
    return route;
  }

  addRouteList(route: string, routeType: string, tableName: string) {
    this.routeList.push({ route: route, routeType: routeType, tableName });
  }

  createTable(route?: any) {
    route = this.cleanupRoute("system/CreateTable", route);
    this.addRouteList(route, "system/CreateTable", "CreateTable");
    this.app.use(`${route}/:tablename`, (req:any, res:any) =>
      this.server.responseDirector.createTable(req, res)
    );
    this.app.use(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.createTable(req, res)
    );
  }

  deleteTable(route?: any) {
    route = this.cleanupRoute("system/DeleteTable", route);
    this.addRouteList(route, "system/DeleteTable", "DeleteTable");
    this.app.use(`${route}/:tablename`, (req:any, res:any) =>
      this.server.responseDirector.deleteTable(req, res)
    );
    this.app.use(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.deleteTable(req, res)
    );
  }

  createColumn(route?: any) {
    route = this.cleanupRoute("system/CreateColumn", route);
    this.addRouteList(route, "system/CreateColumn", "CreateColumn");
    this.app.use(`${route}/:tablename/:columnname/:datatype`, (req:any, res:any) =>
      this.server.responseDirector.createColumn(req, res)
    );
    this.app.use(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.createColumn(req, res)
    );

  }

  createForeignKey(route?: any) {
    route = this.cleanupRoute("system/CreateForeignKey", route);
    this.addRouteList(route, "system/CreateForeignKey", "CreateForeignKey");
    this.app.use(`${route}/:tablename/:targettable`, (req:any, res:any) =>
      this.server.responseDirector.createForeignKey(req, res)
    );
    this.app.use(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.createForeignKey(req, res)
    );

  }

  allReadOnlyApis() {
    this.app.get("/:tablename/exist/:id", (req:any, res:any) => this.allExistId(req, res));
    this.app.get("/:tablename/count", (req:any, res:any) => this.allCountId(req, res));
    this.app.get("/:tablename/:id", (req:any, res:any) => this.allGetId(req, res));
    this.app.get("/:tablename", (req:any, res:any) => this.allGet(req, res));
  }

  allReadWriteApis() {
    this.app.put("/:tablename/:id", (req:any, res:any) => this.allPutId(req, res));
    this.app.patch("/:tablename/:id", (req:any, res:any) => this.allPatchId(req, res));
    this.app.delete("/:tablename/:id", (req:any, res:any) => this.allDeleteId(req, res));
    this.app.post("/:tablename/", (req:any, res:any) => this.allPost(req, res));
    this.app.put("/:tablename/", (req:any, res:any) => this.allPut(req, res));
    this.app.patch("/:tablename/", (req:any, res:any) => this.allPatch(req, res));

  }

  allGet(request: any, response:any) {
    this.server.responseDirector.get(request.params.tablename, request, response);
  }

  allGetId(request: any, response:any) {
    this.server.responseDirector.getId(request.params.tablename, request, response);
  }

  allExistId(request: any, response:any) {
    this.server.responseDirector.existId(request.params.tablename, request, response);
  }

  allCountId(request: any, response:any) {
    this.server.responseDirector.count(request.params.tablename, request, response);
  }

  allPost(request: any, response:any) {
    this.server.responseDirector.post(request.params.tablename, request, response);
  }

  allPut(request: any, response:any) {
    this.server.responseDirector.put(request.params.tablename, request, response);
  }

  allPutId(request: any, response:any) {
    this.server.responseDirector.putId(request.params.tablename, request, response);
  }

  allPatch(request: any, response:any) {
    this.server.responseDirector.patch(request.params.tablename, request, response);
  }

  allPatchId(request: any, response:any) {
    this.server.responseDirector.patchId(request.params.tablename, request, response);
  }

  allDeleteId(request: any, response:any) {
    this.server.responseDirector.deleteId(request.params.tablename, request, response);
  }
}

export class ApiRoutingConfig extends AbstractApiRouting {
  constructor(public server: ApiServer) {
    super(server);
    this.systemApis();
  }

  finalizeRouting() {
    this.app.use(`*`, (req:any, res:any) =>
      this.server.responseDirector.error({
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

  allTablesApis() {
    const viewNames: string[] = this.server.responseDirector.apiDb.dao.viewNames();
    viewNames.forEach((name) => {
      this.readViewApis(name);
    })
    this.allReadOnlyApis();
    this.allReadWriteApis();
  }

  readViewApis(viewName: string, route?:any) {
    this.count(viewName, route);
    this.get(viewName, route);
  }

  get(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(route, "Get", tableName);
    this.app.get(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.get(tableName, req, res)
    );
  }

  getId(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(`${route}/:id`, "GetId", tableName);
    this.app.get(`${route}/:id`, (req:any, res:any) =>
      this.server.responseDirector.getId(tableName, req, res)
    );
  }

  putId(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(`${route}/:id`, "PutId", tableName);
    this.app.put(`${route}/:id`, (req:any, res:any) =>
      this.server.responseDirector.putId(tableName, req, res)
    );
  }

  post(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(route, "Post", tableName);
    this.app.post(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.post(tableName, req, res)
    );
  }

  patch(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(route, "Patch", tableName);
    this.app.patch(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.patch(tableName, req, res)
    );
  }

  put(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(route, "Put", tableName);
    this.app.put(`${route}`, (req:any, res:any) =>
      this.server.responseDirector.put(tableName, req, res)
    );
  }

  patchId(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(`${route}/:id`, "PatchId", tableName);
    this.app.patch(`${route}/:id`, (req:any, res:any) =>
      this.server.responseDirector.patchId(tableName, req, res)
    );
  }

  deleteId(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(`${route}/:id`, "DeleteId", tableName);
    this.app.delete(`${route}/:id`, (req:any, res:any) =>
      this.server.responseDirector.deleteId(tableName, req, res)
    );
  }

  existId(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(`${route}/exist/:id`, "ExistId", tableName);
    this.app.get(`${route}/exist/:id`, (req:any, res:any) =>
      this.server.responseDirector.existId(tableName, req, res)
    );
  }

  count(tableName:string, route?:any) {
    route = this.cleanupRoute(tableName, route);
    this.addRouteList(route, "Count", tableName);
    this.app.get(`${route}/count`, (req:any, res:any) =>
      this.server.responseDirector.count(tableName, req, res)
    );
  }
}

export class ApiRoutingReadOnly extends AbstractApiRouting {
  allTablesApis() {
    throw new Error("Method not implemented.");
  }
  finalizeRouting() {
    throw new Error("Method not implemented.");
  }
  constructor(server: ApiServer) {
    super(server);
    this.allReadOnlyApis();
  }

}

export class ApiRoutingReadWrite extends AbstractApiRouting {
  allTablesApis() {
    throw new Error("Method not implemented.");
  }
  finalizeRouting() {
    throw new Error("Method not implemented.");
  }
  constructor(server: ApiServer) {
    super(server);
    this.allReadOnlyApis();
    this.allReadWriteApis();
  }
}

export class ApiRoutingAdmin extends AbstractApiRouting {
  allTablesApis() {
    throw new Error("Method not implemented.");
  }
  finalizeRouting() {
    throw new Error("Method not implemented.");
  }
  constructor(server: ApiServer) {
    super(server);
    this.systemApis();
    this.allReadOnlyApis();
    this.allReadWriteApis();
  }
}
