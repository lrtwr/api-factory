"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseDirector_1 = require("./../base/ResponseDirector");
var Express = require("express");
var ApiRouting_1 = require("./ApiRouting");
var custom_1 = require("../base/custom");
var enums_1 = require("../base/enums");
var os = require("os");
var cluster = require("cluster");
var ApiServer = /** @class */ (function () {
    function ApiServer(config, listenPort, callback, multiProcessing) {
        if (multiProcessing === void 0) { multiProcessing = false; }
        this.config = config;
        this.listenPort = listenPort;
        this.callback = callback;
        this.lastErrors = [];
        this.workers = [];
        this.status = new custom_1.RunningStatus(enums_1.enumRunningStatus.Down, enums_1.enumRunningStatus.Down, enums_1.enumRunningStatus.Down);
        // start a process cluster
        // one process for every cpu
        if (os.cpus().length > 1 && multiProcessing) {
            if (cluster.isMaster) {
                console.log("Starting multiprocessing system.");
                for (var i = 0; i < os.cpus().length; i++) {
                    this.workers.push(cluster.fork());
                    this.workers[i].on('message', function (message) {
                        console.log(message);
                    });
                }
                cluster.on('online', function (worker) {
                    //console.log('Worker ' + worker.process.pid + ' is listening');
                });
                // if any of the worker process dies then start a new one by simply forking another one
                cluster.on('exit', function (worker, code, signal) {
                    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
                    console.log('Starting a new worker');
                    var wrker = cluster.fork();
                    // to receive messages from worker process
                    wrker.on('message', function (message) { return console.log(message); });
                });
            }
            else
                this.startExpress();
        }
        else
            this.startExpress();
    }
    ApiServer.prototype.startExpress = function () {
        var _this = this;
        var _a;
        var self = this;
        this.app = Express();
        if (!this.config)
            this.addError(null, "Empty configuration is given!");
        this.status.ApiServer = enums_1.enumRunningStatus.ApiServerInitializing;
        var app = this.app
            .listen((_a = this.listenPort, (_a !== null && _a !== void 0 ? _a : 6800)), function () {
            //console.log(`Express server listening on port ${this.listenPort} with the single worker ${process.pid}`)
            console.log(self.config.databaseType +
                "-server is started at url:" +
                app.address().address +
                " port: " +
                app.address().port +
                " process ID: " + process.pid);
            //console.log(process.env);
            _this.status.ApiServer = enums_1.enumRunningStatus.ApiServerUp;
        })
            .on("error", function (error, appCtx) {
            self.lastErrors.push(error);
            if (error.errno === "EADDRINUSE") {
                this.status.apiServer = enums_1.enumRunningStatus.ApiServerError;
                self.addError(error, "EADDRINUSE: " + this.config.listenPort + "is busy.");
            }
            else {
                console.error('app error', error.stack);
                console.error('on url', appCtx.req.url);
                console.error('with headers', appCtx.req.headers);
            }
        });
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
    };
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