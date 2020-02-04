"use strict";
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
var ApiServer_1 = require("./ApiServer");
var daoSupport_1 = require("./daoHandlers/daoSupport");
var factory_1 = require("./setup/factory");
exports.factory = factory_1.factory;
var ApiRouting = /** @class */ (function () {
    function ApiRouting(config, callback) {
        var _this = this;
        this.jsonErrorHandler = function (error, request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(error);
                this.handler.Error(error, request, response);
                return [2 /*return*/];
            });
        }); };
        this.server = new ApiServer_1.ApiServer(config);
        this.app = this.server.app;
        if (!callback)
            callback = function (server) {
                server.AllTablesApis();
                server.FinalizeRouting();
            };
        this.app.use(this.jsonErrorHandler);
        this.handler = daoSupport_1.ApiFactoryHandler.GetDbApiHandler(this, config, this.server.status, callback);
    }
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