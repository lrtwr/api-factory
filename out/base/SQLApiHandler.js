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
Object.defineProperty(exports, "__esModule", { value: true });
var abstracts_1 = require("./abstracts");
var enums_1 = require("./enums");
var factory_1 = require("./factory");
var SQLApiHander = /** @class */ (function (_super) {
    __extends(SQLApiHander, _super);
    function SQLApiHander(dao) {
        var _this = _super.call(this) || this;
        _this.dao = dao;
        _this.jsnRes = new factory_1.ApiJsonResponse();
        return _this;
    }
    SQLApiHander.prototype.Error = function (error, request, response) {
        var promise = Promise.resolve(error);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Error);
    };
    SQLApiHander.prototype.Post = function (tableName, request, response) {
        var promise = this.dao.AsyncPost(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Create);
    };
    SQLApiHander.prototype.Get = function (tableName, request, response) {
        var promise = this.dao.AsyncGet(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Read);
    };
    SQLApiHander.prototype.GetId = function (tableName, request, response) {
        var promise = this.dao.AsyncGetId(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Read);
    };
    SQLApiHander.prototype.Put = function (tableName, request, response) {
        var promise = this.dao.AsyncPut(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Update);
    };
    SQLApiHander.prototype.PutId = function (tableName, request, response) {
        var promise = this.dao.AsyncPut(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Update);
    };
    SQLApiHander.prototype.PatchId = function (tableName, request, response) {
        var promise = this.dao.AsyncPatchId(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Update);
    };
    SQLApiHander.prototype.Patch = function (tableName, request, response) {
        var promise = this.dao.AsyncPatch(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Update);
    };
    SQLApiHander.prototype.DeleteId = function (tableName, request, response) {
        var promise = this.dao.AsyncDeleteId(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Delete);
    };
    SQLApiHander.prototype.ExistId = function (tableName, request, response) {
        var promise = this.dao.AsyncExistId(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Read);
    };
    SQLApiHander.prototype.GetCount = function (tableName, request, response) {
        var promise = this.dao.AsyncCount(tableName, request);
        this.jsnRes.awaitAndRespond(request, response, promise, enums_1.enumApiActions.Count);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    SQLApiHander.prototype.Test = function (_tableName, _request, _response) {
        var i;
        // eslint-disable-next-line prefer-const
        i = 4;
        console.log(i);
    };
    return SQLApiHander;
}(abstracts_1.AbstractApiHandler));
exports.SQLApiHander = SQLApiHander;
//# sourceMappingURL=SQLApiHandler.js.map