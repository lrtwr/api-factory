"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("./factory");
var ApiSQLStatements_1 = require("./ApiSQLStatements");
var AbstractApiHandler = /** @class */ (function () {
    function AbstractApiHandler() {
    }
    return AbstractApiHandler;
}());
exports.AbstractApiHandler = AbstractApiHandler;
var AbstractDaoSupport = /** @class */ (function () {
    function AbstractDaoSupport() {
        var _this = this;
        this.GetTableNames = function () {
            if (!_this.tableProperties.db.table_type)
                return [];
            else if (!_this.tableProperties.db.table_type.table)
                return [];
            return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.table, "table_name");
        };
        this.GetViewNames = function () {
            if (!_this.tableProperties.db.table_type)
                return [];
            else if (!_this.tableProperties.db.table_type.view)
                return [];
            return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.view, "table_name");
        };
    }
    AbstractDaoSupport.prototype.GetColumnProperties = function (tableName) {
        return this.tableProperties.db.table_name[tableName];
    };
    AbstractDaoSupport.prototype.GetModels = function () {
        var _this = this;
        var tables = this.GetTableNames();
        var ret = {};
        var columns;
        var model;
        tables.forEach(function (tableName) {
            model = {};
            _this.tableProperties.db.table_name[tableName].forEach(function (column) {
                model[column.column_name] = column.data_type;
            });
            ret[tableName] = model;
        });
        return ret;
    };
    AbstractDaoSupport.prototype.GetPrimarayKeyColumnName = function (tableName) {
        var ret;
        this.tableProperties.db.table_name[tableName].forEach(function (column) {
            if (column.column_is_pk) {
                ret = column.column_name;
            }
        });
        return ret;
    };
    AbstractDaoSupport.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var postBody;
        if (request.body.insert != null)
            postBody = request.body.insert;
        if (request.body.update != null)
            postBody = request.body.update;
        var promises = [];
        if (postBody instanceof Array) {
            postBody.forEach(function (postItem) {
                if (!postItem.hasOwnProperty(identityColumn)) {
                    var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertFromBodyStatement(tableName, columnProperties, postItem);
                    promises.push(_this.AsyncInsert(answer, sql));
                }
                else {
                    answer.unUsedBodies.push(postItem);
                    answer.message += "Identitycolumn " + identityColumn + " information found. Record probably already created.";
                    answer.unUsedIds.push(postItem[identityColumn]);
                    promises.push(Promise.resolve(answer));
                }
            });
            return Promise.all(promises);
        }
        else {
            if (!postBody.hasOwnProperty(identityColumn)) {
                var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertFromBodyStatement(tableName, columnProperties, postBody);
                return this.AsyncInsert(answer, sql);
            }
            else {
                answer.unUsedBodies.push(postBody);
                answer.message += "Identitycolumn " + identityColumn + " information found. Record probably already created.";
                answer.unUsedIds.push(postBody[identityColumn]);
                promises.push(Promise.resolve(answer));
            }
        }
    };
    AbstractDaoSupport.prototype.AsyncInsert = function (answer, sql) {
        throw new Error("Method not implemented.");
    };
    AbstractDaoSupport.prototype.AsyncPatch = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var postBody;
        if (request.body.insert != null)
            postBody = request.body.insert;
        if (request.body.update != null)
            postBody = request.body.update;
        var promises = [];
        if (postBody instanceof Array) {
            postBody.forEach(function (postItem) {
                if (postItem.hasOwnProperty(identityColumn)) {
                    var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateFromBodyStatement(tableName, identityColumn, columnProperties, postItem);
                    promises.push(_this.AsyncUpdate(answer, sql, postItem[identityColumn]));
                }
                else {
                    answer.unUsedBodies.push(postItem);
                    answer.message += "No information in identitycolumn " + identityColumn + ".";
                    answer.unUsedIds.push(null);
                    promises.push(Promise.resolve(answer));
                }
            });
            return Promise.all(promises);
        }
        else {
            if (postBody.hasOwnProperty(identityColumn)) {
                var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateFromBodyStatement(tableName, identityColumn, columnProperties, postBody);
                return this.AsyncUpdate(answer, sql, postBody[identityColumn]);
            }
            else {
                answer.unUsedBodies.push(postBody);
                answer.message += "No information in identitycolumn " + identityColumn + ".";
                answer.unUsedIds.push(null);
                return Promise.resolve(answer);
            }
        }
    };
    AbstractDaoSupport.prototype.AsyncUpdate = function (answer, sql, arg2) {
        throw new Error("Method not implemented.");
    };
    AbstractDaoSupport.prototype.AsyncPut = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var postBody;
        var sql;
        if (request.body.insert != null)
            postBody = request.body.insert;
        if (request.body.update != null)
            postBody = request.body.update;
        var promises = [];
        if (postBody instanceof Array) {
            postBody.forEach(function (postItem) {
                if (postItem.hasOwnProperty(identityColumn)) {
                    sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateFromBodyStatement(tableName, identityColumn, columnProperties, postItem);
                    promises.push(_this.AsyncUpdate(answer, sql, postItem[identityColumn]));
                }
                else {
                    sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertFromBodyStatement(tableName, columnProperties, postItem);
                    promises.push(_this.AsyncInsert(answer, sql));
                }
            });
            return Promise.all(promises);
        }
        else {
            if (postBody.hasOwnProperty(identityColumn)) {
                sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateFromBodyStatement(tableName, identityColumn, columnProperties, postBody);
                return this.AsyncUpdate(answer, sql, postBody[identityColumn]);
            }
            else {
                var sql_1 = ApiSQLStatements_1.ApiSQLStatements.GetInsertFromBodyStatement(tableName, columnProperties, postBody);
                return this.AsyncInsert(answer, sql_1);
            }
        }
    };
    return AbstractDaoSupport;
}());
exports.AbstractDaoSupport = AbstractDaoSupport;
//# sourceMappingURL=abstracts.js.map