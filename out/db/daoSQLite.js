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
var ApiSQLStatements_1 = require("../base/ApiSQLStatements");
var abstracts_1 = require("../base/abstracts");
var factory_1 = require("../base/factory");
var enums_1 = require("../base/enums");
var sqlite3 = require("sqlite3");
sqlite3.verbose();
var DaoSQLite = /** @class */ (function (_super) {
    __extends(DaoSQLite, _super);
    function DaoSQLite(server, config, status, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = _this;
        _this.db = new sqlite3.Database(self.config.database, sqlite3.OPEN_READWRITE, function (error) {
            if (error) {
                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                console.log(error);
                _this.server.lastErrors.push(error);
            }
        });
        // this.db = new sqlite3.Database("./node_modules/apimatic/apitest2.db",sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, error => {
        //   if (error) {
        //     self.status.DbConnect = enumRunningStatus.DbConnectError;
        //     console.log(error);
        //     this.server.lastErrors.push(error);
        //   }
        // });
        _this.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
        console.log("Connected to SQLite database: " + self.config.database);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSQLiteTableColumnInfoStatement();
        _this.db.all(sql, function (error, result) {
            if (error) {
                _this.server.lastErrors.push(error);
            }
            else {
                self.tableProperties = new factory_1.JsonDatabase(result, ["table_name", "table_type"]);
                self.callback(self.server.routing);
            }
        });
        return _this;
    }
    DaoSQLite.prototype.AsyncInsert = function (answer, sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
                if (error)
                    reject(error);
                answer.createdIds.push("" + this.lastID);
                answer.created++;
                answer.count++;
                resolve(answer);
            });
        });
    };
    DaoSQLite.prototype.AsyncUpdate = function (answer, sql, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
                if (error)
                    reject(error);
                answer.updatedIds.push(id);
                answer.updated++;
                answer.count++;
                resolve(answer);
            });
        });
    };
    DaoSQLite.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
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
    DaoSQLite.prototype.AsyncPutId = function (tableName, request) {
        return this.AsyncPatchId(tableName, request);
    };
    DaoSQLite.prototype.AsyncPatchId = function (tableName, request) {
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return this.AsyncUpdate(answer, sql, request.params.id);
    };
    DaoSQLite.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                answer.rows = result;
                resolve(answer);
            });
        });
    };
    DaoSQLite.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                answer.count = rows;
                resolve(answer);
            });
        });
    };
    DaoSQLite.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var answer = new factory_1.DaoResult(request);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                answer.rows = rows;
                resolve(answer);
            });
        });
    };
    DaoSQLite.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                answer.rows = rows;
                resolve(answer);
            });
        });
    };
    return DaoSQLite;
}(abstracts_1.AbstractDaoSupport));
exports.DaoSQLite = DaoSQLite;
//# sourceMappingURL=daoSQLite.js.map