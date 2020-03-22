"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var BodyParser = require("body-parser");
var AbstractApiRouting = /** @class */ (function () {
    function AbstractApiRouting(server) {
        var _this = this;
        this.server = server;
        this.routeList = [];
        this.jsonErrorHandler = function (error, request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.server.addError(error, "Express error.");
                return [2 /*return*/];
            });
        }); };
        this.app = this.server.app;
        this.config = this.server.config;
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(this.jsonErrorHandler);
        this.app.use("/Status", function (req, res) { return _this.getStatus(res); });
    }
    AbstractApiRouting.prototype.systemApis = function () {
        var _this = this;
        this.createTable();
        this.deleteTable();
        this.createColumn();
        this.createForeignKey();
        this.app.use("/system/TableNames", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.tableNames()); });
        this.addRouteList("/system/TableNames", "*", "Database Tablenames.");
        this.app.use("/system/ModelInfo/:id", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.models(req.params.id)); });
        this.addRouteList("/system/ModelInfo", "*/tableName", "Database Model Definition id: tablename");
        this.app.use("/system/ModelInfo", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.models()); });
        this.addRouteList("/system/ModelInfo", "*", "Database Model Definition.");
        this.addRouteList("/system/ColumnInfo/:id", "*/tableName", "Column properties id: tablename");
        this.app.use("/system/ColumnInfo/:id", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.columnProperties(req.params.id)); });
        this.app.use("/system/ColumnInfo", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.tableProperties.baseArray); });
        this.addRouteList("/system/ColumnInfo", "*/tableName", "Database Column Definition.");
        this.app.use("/system/PrimaryKeys/:id", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.primaryKeys(req.params.id)); });
        this.addRouteList("/system/PrimaryKeys/:id", "*/tableName", "Get PrimaryKey id: tablename");
        this.app.use("/system/PrimaryKeys", function (req, res) { return res.json(_this.server.responseDirector.apiDb.dao.primaryKeys()); });
        this.addRouteList("/system/PrimaryKeys", "*/tableName", "Get PrimaryKey id: tablename");
    };
    AbstractApiRouting.prototype.getStatus = function (response) {
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
    AbstractApiRouting.prototype.cleanupRoute = function (tableName, route) {
        if (!route)
            route = "/" + tableName;
        else {
            if (route.substring(0, 1) != "/")
                route = "/" + route;
        }
        return route;
    };
    AbstractApiRouting.prototype.addRouteList = function (route, routeType, tableName) {
        this.routeList.push({ route: route, routeType: routeType, tableName: tableName });
    };
    AbstractApiRouting.prototype.createTable = function (route) {
        var _this = this;
        route = this.cleanupRoute("system/CreateTable", route);
        this.addRouteList(route, "system/CreateTable", "CreateTable");
        this.app.use(route + "/:tablename", function (req, res) {
            return _this.server.responseDirector.createTable(req, res);
        });
        this.app.use("" + route, function (req, res) {
            return _this.server.responseDirector.createTable(req, res);
        });
    };
    AbstractApiRouting.prototype.deleteTable = function (route) {
        var _this = this;
        route = this.cleanupRoute("system/DeleteTable", route);
        this.addRouteList(route, "system/DeleteTable", "DeleteTable");
        this.app.use(route + "/:tablename", function (req, res) {
            return _this.server.responseDirector.deleteTable(req, res);
        });
        this.app.use("" + route, function (req, res) {
            return _this.server.responseDirector.deleteTable(req, res);
        });
    };
    AbstractApiRouting.prototype.createColumn = function (route) {
        var _this = this;
        route = this.cleanupRoute("system/CreateColumn", route);
        this.addRouteList(route, "system/CreateColumn", "CreateColumn");
        this.app.use(route + "/:tablename/:columnname/:datatype", function (req, res) {
            return _this.server.responseDirector.createColumn(req, res);
        });
        this.app.use("" + route, function (req, res) {
            return _this.server.responseDirector.createColumn(req, res);
        });
    };
    AbstractApiRouting.prototype.createForeignKey = function (route) {
        var _this = this;
        route = this.cleanupRoute("system/CreateForeignKey", route);
        this.addRouteList(route, "system/CreateForeignKey", "CreateForeignKey");
        this.app.use(route + "/:tablename/:targettable", function (req, res) {
            return _this.server.responseDirector.createForeignKey(req, res);
        });
        this.app.use("" + route, function (req, res) {
            return _this.server.responseDirector.createForeignKey(req, res);
        });
    };
    AbstractApiRouting.prototype.allReadOnlyApis = function () {
        var _this = this;
        this.app.get("/:tablename/exist/:id", function (req, res) { return _this.allExistId(req, res); });
        this.app.get("/:tablename/count", function (req, res) { return _this.allCountId(req, res); });
        this.app.get("/:tablename/:id", function (req, res) { return _this.allGetId(req, res); });
        this.app.get("/:tablename", function (req, res) { return _this.allGet(req, res); });
    };
    AbstractApiRouting.prototype.allReadWriteApis = function () {
        var _this = this;
        this.app.put("/:tablename/:id", function (req, res) { return _this.allPutId(req, res); });
        this.app.patch("/:tablename/:id", function (req, res) { return _this.allPatchId(req, res); });
        this.app.delete("/:tablename/:id", function (req, res) { return _this.allDeleteId(req, res); });
        this.app.post("/:tablename/", function (req, res) { return _this.allPost(req, res); });
        this.app.put("/:tablename/", function (req, res) { return _this.allPut(req, res); });
        this.app.patch("/:tablename/", function (req, res) { return _this.allPatch(req, res); });
    };
    AbstractApiRouting.prototype.allGet = function (request, response) {
        this.server.responseDirector.get(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allGetId = function (request, response) {
        this.server.responseDirector.getId(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allExistId = function (request, response) {
        this.server.responseDirector.existId(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allCountId = function (request, response) {
        this.server.responseDirector.getCount(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allPost = function (request, response) {
        this.server.responseDirector.post(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allPut = function (request, response) {
        this.server.responseDirector.put(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allPutId = function (request, response) {
        this.server.responseDirector.putId(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allPatch = function (request, response) {
        this.server.responseDirector.patch(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allPatchId = function (request, response) {
        this.server.responseDirector.patchId(request.params.tablename, request, response);
    };
    AbstractApiRouting.prototype.allDeleteId = function (request, response) {
        this.server.responseDirector.deleteId(request.params.tablename, request, response);
    };
    return AbstractApiRouting;
}());
exports.AbstractApiRouting = AbstractApiRouting;
var ApiRoutingConfig = /** @class */ (function (_super) {
    __extends(ApiRoutingConfig, _super);
    function ApiRoutingConfig(server) {
        var _this = _super.call(this, server) || this;
        _this.server = server;
        _this.systemApis();
        return _this;
    }
    ApiRoutingConfig.prototype.finalizeRouting = function () {
        var _this = this;
        this.app.use("*", function (req, res) {
            return _this.server.responseDirector.error({
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
    ApiRoutingConfig.prototype.allTablesApis = function () {
        var _this = this;
        var viewNames = this.server.responseDirector.apiDb.dao.viewNames();
        viewNames.forEach(function (name) {
            _this.readViewApis(name);
        });
        this.allReadOnlyApis();
        this.allReadWriteApis();
    };
    ApiRoutingConfig.prototype.readViewApis = function (viewName, route) {
        this.count(viewName, route);
        this.get(viewName, route);
    };
    ApiRoutingConfig.prototype.get = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route, "Get", tableName);
        this.app.get("" + route, function (req, res) {
            return _this.server.responseDirector.get(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.getId = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route + "/:id", "GetId", tableName);
        this.app.get(route + "/:id", function (req, res) {
            return _this.server.responseDirector.getId(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.putId = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route + "/:id", "PutId", tableName);
        this.app.put(route + "/:id", function (req, res) {
            return _this.server.responseDirector.putId(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.post = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route, "Post", tableName);
        this.app.post("" + route, function (req, res) {
            return _this.server.responseDirector.post(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.patch = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route, "Patch", tableName);
        this.app.patch("" + route, function (req, res) {
            return _this.server.responseDirector.patch(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.put = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route, "Put", tableName);
        this.app.put("" + route, function (req, res) {
            return _this.server.responseDirector.put(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.patchId = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route + "/:id", "PatchId", tableName);
        this.app.patch(route + "/:id", function (req, res) {
            return _this.server.responseDirector.patchId(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.deleteId = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route + "/:id", "DeleteId", tableName);
        this.app.delete(route + "/:id", function (req, res) {
            return _this.server.responseDirector.deleteId(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.existId = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route + "/exist/:id", "ExistId", tableName);
        this.app.get(route + "/exist/:id", function (req, res) {
            return _this.server.responseDirector.existId(tableName, req, res);
        });
    };
    ApiRoutingConfig.prototype.count = function (tableName, route) {
        var _this = this;
        route = this.cleanupRoute(tableName, route);
        this.addRouteList(route, "Count", tableName);
        this.app.get(route + "/count", function (req, res) {
            return _this.server.responseDirector.getCount(tableName, req, res);
        });
    };
    return ApiRoutingConfig;
}(AbstractApiRouting));
exports.ApiRoutingConfig = ApiRoutingConfig;
var ApiRoutingReadOnly = /** @class */ (function (_super) {
    __extends(ApiRoutingReadOnly, _super);
    function ApiRoutingReadOnly(server) {
        var _this = _super.call(this, server) || this;
        _this.allReadOnlyApis();
        return _this;
    }
    ApiRoutingReadOnly.prototype.allTablesApis = function () {
        throw new Error("Method not implemented.");
    };
    ApiRoutingReadOnly.prototype.finalizeRouting = function () {
        throw new Error("Method not implemented.");
    };
    return ApiRoutingReadOnly;
}(AbstractApiRouting));
exports.ApiRoutingReadOnly = ApiRoutingReadOnly;
var ApiRoutingReadWrite = /** @class */ (function (_super) {
    __extends(ApiRoutingReadWrite, _super);
    function ApiRoutingReadWrite(server) {
        var _this = _super.call(this, server) || this;
        _this.allReadOnlyApis();
        _this.allReadWriteApis();
        return _this;
    }
    ApiRoutingReadWrite.prototype.allTablesApis = function () {
        throw new Error("Method not implemented.");
    };
    ApiRoutingReadWrite.prototype.finalizeRouting = function () {
        throw new Error("Method not implemented.");
    };
    return ApiRoutingReadWrite;
}(AbstractApiRouting));
exports.ApiRoutingReadWrite = ApiRoutingReadWrite;
var ApiRoutingAdmin = /** @class */ (function (_super) {
    __extends(ApiRoutingAdmin, _super);
    function ApiRoutingAdmin(server) {
        var _this = _super.call(this, server) || this;
        _this.systemApis();
        _this.allReadOnlyApis();
        _this.allReadWriteApis();
        return _this;
    }
    ApiRoutingAdmin.prototype.allTablesApis = function () {
        throw new Error("Method not implemented.");
    };
    ApiRoutingAdmin.prototype.finalizeRouting = function () {
        throw new Error("Method not implemented.");
    };
    return ApiRoutingAdmin;
}(AbstractApiRouting));
exports.ApiRoutingAdmin = ApiRoutingAdmin;
//# sourceMappingURL=ApiRouting.js.map