"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../base/enums");
var ApiRouting = /** @class */ (function () {
    function ApiRouting(server) {
        var _this = this;
        this.server = server;
        this.routeList = [];
        this.app = this.server.app;
        this.config = this.server.config;
        this.app.use("/Status", function (req, res) { return _this.GetStatus(res); });
        if (this.config.databaseType != enums_1.enumDatabaseType.MongoDb) {
            this.app.use("/Models", function (req, res) { return res.json(_this.server.dbHandler.dao.GetModels()); });
            this.AddRouteList("/Models", "*", "Database Model Definition.");
            this.app.use("/ColumnProperties", function (req, res) { return res.json(_this.server.dbHandler.dao.tableProperties.baseArray); });
            this.AddRouteList("/ColumnProperties", "*", "Database Column Definition.");
        }
    }
    ApiRouting.prototype.FinalizeRouting = function () {
        var _this = this;
        this.app.use("*", function (req, res) {
            return _this.server.dbHandler.Error({
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
    ApiRouting.prototype.GetStatus = function (response) {
        var conf2 = this.server.config;
        conf2.password = "********";
        conf2.user = "********";
        var aJson = [];
        aJson.push(this.server.status);
        aJson.push(conf2);
        aJson.push({ "errors": this.server.lastErrors });
        aJson.push(this.routeList);
        response.json(aJson);
    };
    ApiRouting.prototype.AllTablesApis = function () {
        var _this = this;
        var tableNames = this.server.dbHandler.dao.GetTableNames();
        tableNames.forEach(function (name) {
            _this.TableApis(name);
        });
        var viewNames = this.server.dbHandler.dao.GetViewNames();
        viewNames.forEach(function (name) {
            _this.ReadViewApis(name);
        });
    };
    ApiRouting.prototype.TableApis = function (tableName, route) {
        this.ReadTableApis(tableName, route);
        this.Post(tableName, route);
        this.Put(tableName, route);
        this.Patch(tableName, route);
        this.PutId(tableName, route);
        this.PatchId(tableName, route);
        this.DeleteId(tableName, route);
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
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "Get", tableName);
        this.app.get("" + route, function (req, res) {
            return _this.server.dbHandler.Get(tableName, req, res);
        });
    };
    ApiRouting.prototype.GetId = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "GetId", tableName);
        this.app.get(route + "/:id", function (req, res) {
            return _this.server.dbHandler.GetId(tableName, req, res);
        });
    };
    ApiRouting.prototype.PutId = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "PutId", tableName);
        this.app.put(route + "/:id", function (req, res) {
            return _this.server.dbHandler.PutId(tableName, req, res);
        });
    };
    ApiRouting.prototype.Post = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "Post", tableName);
        this.app.post("" + route, function (req, res) {
            return _this.server.dbHandler.Post(tableName, req, res);
        });
    };
    ApiRouting.prototype.Patch = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "Patch", tableName);
        this.app.patch("" + route, function (req, res) {
            return _this.server.dbHandler.Patch(tableName, req, res);
        });
    };
    ApiRouting.prototype.Put = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "Put", tableName);
        this.app.put("" + route, function (req, res) {
            return _this.server.dbHandler.Put(tableName, req, res);
        });
    };
    ApiRouting.prototype.PatchId = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "PatchId", tableName);
        this.app.patch(route + "/:id", function (req, res) {
            return _this.server.dbHandler.PatchId(tableName, req, res);
        });
    };
    ApiRouting.prototype.DeleteId = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route);
        this.AddRouteList(route, "DeleteId", tableName);
        this.app.delete(route + "/:id", function (req, res) {
            return _this.server.dbHandler.DeleteId(tableName, req, res);
        });
    };
    ApiRouting.prototype.ExistId = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route) + '-exist';
        this.AddRouteList(route, "ExistId", tableName);
        this.app.get(route + "/:id", function (req, res) {
            return _this.server.dbHandler.ExistId(tableName, req, res);
        });
    };
    ApiRouting.prototype.Count = function (tableName, route) {
        var _this = this;
        route = this.CleanupRoute(tableName, route) + "-count";
        this.AddRouteList(route, "Count", tableName);
        this.app.get("" + route, function (req, res) {
            return _this.server.dbHandler.GetCount(tableName, req, res);
        });
    };
    ApiRouting.prototype.AddRouteList = function (route, routeType, tableName) {
        this.routeList.push({ route: route, routeType: routeType, tableName: tableName });
    };
    ApiRouting.prototype.CleanupRoute = function (tableName, route) {
        if (!route)
            route = "/" + tableName;
        else {
            if (route.substring(0, 1) != "/")
                route = "/" + route;
        }
        return route;
    };
    return ApiRouting;
}());
exports.ApiRouting = ApiRouting;
//# sourceMappingURL=ApiRouting.js.map