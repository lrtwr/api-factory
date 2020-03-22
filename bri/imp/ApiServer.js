"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseDirector_1 = require("./../base/ResponseDirector");
var Express = require("express");
var ApiRouting_1 = require("./ApiRouting");
var custom_1 = require("../base/custom");
var enums_1 = require("../base/enums");
var ApiServer = /** @class */ (function () {
    function ApiServer(config, listenPort, callback) {
        var _this = this;
        this.config = config;
        this.listenPort = listenPort;
        this.callback = callback;
        this.lastErrors = [];
        this.status = new custom_1.RunningStatus(enums_1.enumRunningStatus.Down, enums_1.enumRunningStatus.Down, enums_1.enumRunningStatus.Down);
        this.app = Express();
        var self = this;
        if (!this.config)
            this.addError(null, "Empty configuration is given!");
        if (this.listenPort == null)
            this.listenPort = 6800;
        this.status.ApiServer = enums_1.enumRunningStatus.ApiServerInitializing;
        var api = this.app
            .listen(this.listenPort, function () {
            console.log(self.config.databaseType +
                "-server is started at url:" +
                api.address().address +
                " port: " +
                api.address().port);
            console.log(process.env);
            console.log(process.env.PORT);
            _this.status.ApiServer = enums_1.enumRunningStatus.ApiServerUp;
        })
            .on("error", function (error) {
            self.lastErrors.push(error);
            if (error.errno === "EADDRINUSE") {
                this.status.apiServer = enums_1.enumRunningStatus.ApiServerError;
                self.addError(error, "EADDRINUSE: " + this.config.listenPort + "is busy.");
            }
            else {
                self.addError(error, "Connection error.");
            }
        });
        //this.routing = new ApiRoutingConfig(this);
        switch (this.config.operationMode) {
            case enums_1.enumOperationMode.ReadOnly:
                this.routing = new ApiRouting_1.ApiRoutingReadOnly(this);
                break;
            case enums_1.enumOperationMode.ReadWrite:
                this.routing = new ApiRouting_1.ApiRoutingReadWrite(this);
                break;
            case enums_1.enumOperationMode.Admin:
                this.routing = new ApiRouting_1.ApiRoutingAdmin(this);
                break;
            default:
                this.routing = new ApiRouting_1.ApiRoutingConfig(this);
                break;
        }
        this.responseDirector = new ResponseDirector_1.ResponseDirector(this);
    }
    ApiServer.prototype.addError = function (errorObject, message) {
        var newErrorObj = {};
        newErrorObj["error"] = errorObject;
        newErrorObj.message = errorObject.message;
        if (message)
            newErrorObj["message"] = message;
        this.lastErrors.push({ newErrorObj: newErrorObj });
        console.log(errorObject);
    };
    return ApiServer;
}());
exports.ApiServer = ApiServer;
//# sourceMappingURL=ApiServer.js.map