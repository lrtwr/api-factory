"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var custom_1 = require("./custom");
var ApiDaoFactory_1 = require("../db/ApiDaoFactory");
var requestInfo_1 = require("./requestInfo");
var ResponseDirector = /** @class */ (function () {
    function ResponseDirector(server) {
        this.jsnRes = new custom_1.ApiJsonResponse();
        this.apiDb = ApiDaoFactory_1.ApiDaoFactory.GetApiDbHandler(server);
    }
    ResponseDirector.prototype.error = function (error, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request);
        var promise = Promise.resolve(error);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Error);
    };
    ResponseDirector.prototype.post = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncPost(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Create);
    };
    ResponseDirector.prototype.get = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncGet(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Read);
    };
    ResponseDirector.prototype.getId = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncGetId(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Read);
    };
    ResponseDirector.prototype.put = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncPut(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Update);
    };
    ResponseDirector.prototype.putId = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncPutId(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Update);
    };
    ResponseDirector.prototype.patchId = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncPatchId(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Update);
    };
    ResponseDirector.prototype.patch = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncPatch(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Update);
    };
    ResponseDirector.prototype.deleteId = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncDeleteId(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Delete);
    };
    ResponseDirector.prototype.existId = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncExistId(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Read);
    };
    ResponseDirector.prototype.count = function (tableName, request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request, tableName);
        var promise = this.apiDb.asyncCount(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.Count);
    };
    ResponseDirector.prototype.createTable = function (request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request);
        var promise = this.apiDb.asyncCreateTable(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.System);
    };
    ResponseDirector.prototype.deleteTable = function (request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request);
        var promise = this.apiDb.asyncDeleteTable(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.System);
    };
    ResponseDirector.prototype.createColumn = function (request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request);
        var promise = this.apiDb.asyncCreateColumn(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.System);
    };
    ResponseDirector.prototype.createForeignKey = function (request, response) {
        var requestInfo = new requestInfo_1.RequestInfo(request);
        var promise = this.apiDb.asyncCreateForeignKey(requestInfo);
        this.jsnRes.awaitAndRespond(requestInfo, response, promise, enums_1.enumApiActions.System);
    };
    return ResponseDirector;
}());
exports.ResponseDirector = ResponseDirector;
//# sourceMappingURL=responseDirector.js.map