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
var Express = require("express");
var BodyParser = require("body-parser");
var factory_1 = require("./setup/factory");
var factory_2 = require("./setup/factory");
exports.factory = factory_2.factory;
var ApiServer = /** @class */ (function () {
    function ApiServer(config) {
        var _this = this;
        this.config = config;
        this.routeList = [];
        this.lastErrors = [];
        this.jsonErrorHandler = function (error, request, response, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(error);
                this.lastErrors.push(error);
                return [2 /*return*/];
            });
        }); };
        console.log("Starting api server.");
        var self = this;
        this.app = Express();
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(this.jsonErrorHandler);
        //this.app.use(this.app.router); 
        this.status = new factory_1.factory.RunningStatus(factory_1.factory.enums.enumRunningStatus.Down, factory_1.factory.enums.enumRunningStatus.Down, factory_1.factory.enums.enumRunningStatus.Down);
        if (!config)
            console.log("Empty configuration is given!");
        this.status.ApiServer = factory_1.factory.enums.enumRunningStatus.ApiServerInitializing;
        var api = this.app
            .listen(config.listenPort, function () {
            console.log("Server is started at url:" +
                api.address().address +
                " port: " +
                api.address().port);
            _this.status.ApiServer = factory_1.factory.enums.enumRunningStatus.ApiServerUp;
        })
            .on("error", function (error) {
            self.lastErrors.push(error);
            console.log("foutje!!!!!!!!!!!!!!!!!");
            if (error.errno === "EADDRINUSE") {
                this.status.apiServer = factory_1.factory.enums.enumRunningStatus.ApiServerError;
                console.log("Port " + config.listenPort + " is busy");
            }
            else {
                console.log(error);
            }
        });
        this.Status();
    }
    ApiServer.prototype.AddRouteList = function (route, routeType, tableName) {
        this.routeList.push({ route: route, routeType: routeType, tableName: tableName });
    };
    ApiServer.prototype.GetStatus = function (request, response) {
        var conf2 = this.config;
        conf2.password = "********";
        conf2.user = "********";
        var aJson = [];
        aJson.push(this.status);
        aJson.push(conf2);
        aJson.push({ "errors": this.lastErrors });
        aJson.push(this.routeList);
        response.json(aJson);
    };
    ApiServer.prototype.Status = function () {
        var _this = this;
        this.app.use("/Status", function (req, res) { return _this.GetStatus(req, res); });
    };
    ApiServer.prototype.CleanupRoute = function (tableName, route) {
        if (!route)
            route = "/" + tableName;
        else {
            if (route.substring(0, 1) != "/")
                route = "/" + route;
        }
        return route;
    };
    return ApiServer;
}());
exports.ApiServer = ApiServer;
//# sourceMappingURL=ApiServer.js.map