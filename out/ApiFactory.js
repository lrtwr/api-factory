"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiServer_1 = require("./ApiServer");
var daoSupport_1 = require("./daoHandlers/daoSupport");
var factory_1 = require("./setup/factory");
exports.factory = factory_1.factory;
var ApiRouting = /** @class */ (function () {
    function ApiRouting(config, callback) {
        this.config = config;
        this.server = new ApiServer_1.ApiServer(config);
        this.app = this.server.app;
        var self = this;
        if (!callback)
            callback = function (server) {
                server.AllTablesApis();
                server.FinalizeRouting();
            };
        this.handler = daoSupport_1.ApiFactoryHandler.GetDbApiHandler(this, config, this.server.status, callback);
    }
    ApiRouting.prototype.GetStatus = function (request, response, lastErrors) {
        var conf2 = this.config;
        conf2.password = "********";
        conf2.user = "********";
        var aJson = [];
        aJson.push(this.server.status);
        aJson.push({ "configuration": conf2 });
        aJson.push(lastErrors);
        aJson.push(this.server.routeList);
        response.json(aJson);
    };
    ApiRouting.prototype.Status = function () {
        var _this = this;
        this.app.use("/Status", function (req, res) { return _this.GetStatus(req, res, _this.server.lastErrors); });
    };
    ApiRouting.prototype.FinalizeRouting = function () {
        var _this = this;
        this.app.use("*", function (req, res) {
            return _this.handler.Error({
                body: req.body,
                expose: true,
                message: "Unhandled route. See /status for usable routing.",
                stack: "No internal api-server error.",
                status: 404,
                statusCode: 404,
                type: "route error"
            }, req, res);
        });
    };
    ApiRouting.prototype.AllTablesApis = function () {
        var _this = this;
        var deze = this;
        var tableNames = this.handler.dao.GetTableNames();
        tableNames.forEach(function (name) {
            _this.TableApis(name);
        });
        var viewNames = this.handler.dao.GetViewNames();
        viewNames.forEach(function (name) {
            _this.ReadViewApis(name);
        });
    };
    ApiRouting.prototype.TableApis = function (tableName, route) {
        this.Post(tableName, route);
        this.Put(tableName, route);
        this.PutId(tableName, route);
        this.PatchId(tableName, route);
        this.DeleteId(tableName, route);
        this.ReadTableApis(tableName, route);
    };
    ApiRouting.prototype.ReadTableApis = function (tableName, route) {
        this.Count(tableName, route);
        this.ExistId(tableName, route);
        this.Get(tableName, route);
        this.GetId(tableName, route);
    };
    ApiRouting.prototype.ReadViewApis = function (viewName, route) {
        this.Count(viewName, route);
        this.Get(viewName, route);
    };
    ApiRouting.prototype.Get = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "Get", tableName);
        this.app.get("" + route, function (req, res) {
            return _this.handler.Get(tableName, req, res);
        });
    };
    ApiRouting.prototype.GetId = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "GetId", tableName);
        this.app.get(route + "/:id", function (req, res) {
            return _this.handler.GetId(tableName, req, res);
        });
    };
    ApiRouting.prototype.Put = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "Put", tableName);
        this.app.put("" + route, function (req, res) {
            return _this.handler.Put(tableName, req, res);
        });
    };
    ApiRouting.prototype.PutId = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "PutId", tableName);
        this.app.put(route + "/:id", function (req, res) {
            return _this.handler.PutId(tableName, req, res);
        });
    };
    ApiRouting.prototype.Post = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "Post", tableName);
        this.app.post("" + route, function (req, res) {
            return _this.handler.Post(tableName, req, res);
        });
    };
    ApiRouting.prototype.PatchId = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "PatchId", tableName);
        this.app.patch(route + "/:id", function (req, res) {
            return _this.handler.PatchId(tableName, req, res);
        });
    };
    ApiRouting.prototype.DeleteId = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route);
        this.server.AddRouteList(route, "DeleteId", tableName);
        this.app.delete(route + "/:id", function (req, res) {
            return _this.handler.DeleteId(tableName, req, res);
        });
    };
    ApiRouting.prototype.ExistId = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route) + '-exist';
        this.server.AddRouteList(route, "ExistId", tableName);
        this.app.get(route + "/:id", function (req, res) {
            return _this.handler.ExistId(tableName, req, res);
        });
    };
    ApiRouting.prototype.Count = function (tableName, route) {
        var _this = this;
        route = this.server.CleanupRoute(tableName, route) + "-count";
        this.server.AddRouteList(route, "Count", tableName);
        this.app.get("" + route, function (req, res) {
            return _this.handler.GetCount(tableName, req, res);
        });
    };
    return ApiRouting;
}());
exports.ApiRouting = ApiRouting;
//# sourceMappingURL=ApiFactory.js.map