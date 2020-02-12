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
        self.db = new sqlite3.Database(self.config.database, function (error) {
            if (error) {
                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                console.log(error);
                _this.server.lastErrors.push(error);
            }
        });
        self.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
        console.log("Connected to SQLite database: " + self.config.database);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSQLiteTableColumnInfoStatement();
        self.db.all(sql, function (error, result) {
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
    DaoSQLite.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertStatement(tableName, columnProperties, request);
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("" + this.lastID);
                console.log("lastID " + this.lastID);
            });
        });
    };
    DaoSQLite.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("{result: 1}");
                console.log("result: 1");
            });
        });
    };
    DaoSQLite.prototype.AsyncPatchId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.db.run(sql, function (error) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("1");
                console.log("result: 1");
            });
        });
    };
    DaoSQLite.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    DaoSQLite.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    DaoSQLite.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    DaoSQLite.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    return DaoSQLite;
}(abstracts_1.AbstractDaoSupport));
exports.DaoSQLite = DaoSQLite;
//# sourceMappingURL=daoSQLite.js.map