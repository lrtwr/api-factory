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
var mysql = require("mysql");
var ApiSQLStatements_1 = require("../base/ApiSQLStatements");
var abstracts_1 = require("../base/abstracts");
var factory_1 = require("../base/factory");
var enums_1 = require("../base/enums");
var DaoMySQL = /** @class */ (function (_super) {
    __extends(DaoMySQL, _super);
    function DaoMySQL(server, config, status, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = _this;
        var db = mysql.createConnection({
            host: _this.config.host,
            user: _this.config.user,
            password: _this.config.password,
            database: _this.config.database,
            port: _this.config.port
        });
        _this.db = db;
        db.connect(function (error) {
            if (error) {
                _this.server.lastErrors.push(error);
                throw error;
            }
            var sql = ApiSQLStatements_1.ApiSQLStatements.GetMySQLTableColumnInfoStatement(_this.config.database);
            db.query(sql, function (error, result) {
                if (error) {
                    _this.server.lastErrors.push(error);
                    throw error;
                }
                self.tableProperties = new factory_1.JsonDatabase(result, [
                    "table_name",
                    "table_type"
                ]);
                console.log("Connected to MySQL: `" + _this.config.database + "`!");
                _this.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                self.callback(self.server.routing);
            });
        });
        return _this;
    }
    DaoMySQL.prototype.AsyncInsert = function (answer, sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.createdIds.push(result.insertId);
                answer.created++;
                answer.count++;
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncUpdate = function (answer, sql, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.updatedIds.push(id);
                answer.updated++;
                answer.count++;
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                answer.deleted++;
                answer.deletedIds.push(request.params.id);
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncPutId = function (tableName, request) { return this.AsyncPatchId(tableName, request); };
    DaoMySQL.prototype.AsyncPatchId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                answer.updated++;
                answer.updatedIds.push(request.params.id);
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.rows = result;
                answer.count = answer.rows.length;
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.count = result;
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.rows = result;
                answer.count = answer.rows.length;
                resolve(answer);
            });
        });
    };
    DaoMySQL.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    answer.count = result;
                resolve(answer);
            });
        });
    };
    return DaoMySQL;
}(abstracts_1.AbstractDaoSupport));
exports.DaoMySQL = DaoMySQL;
//# sourceMappingURL=daoMySQL.js.map