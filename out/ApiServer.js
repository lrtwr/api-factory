"use strict";
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
        console.log("Starting api server.");
        this.app = Express();
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({ extended: true }));
        //this.app.use(this.app.router); 
        this.status = new factory_1.factory.RunningStatus(factory_1.factory.enumRunningStatus.Down, factory_1.factory.enumRunningStatus.Down, factory_1.factory.enumRunningStatus.Down);
        if (!config)
            console.log("Empty configuration is given!");
        this.status.ApiServer = factory_1.factory.enumRunningStatus.ApiServerInitializing;
        var api = this.app
            .listen(config.listenPort, function () {
            console.log("Server is started at url:" +
                api.address().address +
                " port: " +
                api.address().port);
            _this.status.ApiServer = factory_1.factory.enumRunningStatus.ApiServerUp;
        })
            .on("error", function (err) {
            console.log("foutje!!!!!!!!!!!!!!!!!");
            if (err.errno === "EADDRINUSE") {
                this.status.apiServer = factory_1.factory.enumRunningStatus.ApiServerError;
                console.log("Port " + config.listenPort + " is busy");
            }
            else {
                console.log(err);
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