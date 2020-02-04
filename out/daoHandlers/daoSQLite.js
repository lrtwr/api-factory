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
var sqlite3 = require("sqlite3").verbose();
var ApiSQLStatements_1 = require("../setup/ApiSQLStatements");
var factory_1 = require("../setup/factory");
var daoSQLite = /** @class */ (function (_super) {
    __extends(daoSQLite, _super);
    function daoSQLite(server, config, status, callback) {
        var _this = _super.call(this, status) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        _this.AsyncConnect();
        return _this;
    }
    daoSQLite.prototype.AsyncConnect = function () {
        var deze = this;
        deze.database = new sqlite3.Database(deze.config.database, function (error) {
            if (error) {
                deze.status.DbConnect = factory_1.factory.enumRunningStatus.DbConnectError;
                console.log(error);
            }
        });
        deze.status.DbConnect = factory_1.factory.enumRunningStatus.DbConnectConnected;
        console.log("Connected to SQLite database: " + deze.config.database);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSQLiteTableColumnInfoStatement();
        deze.database.all(sql, function (error, result) {
            deze.tableProperties = new factory_1.factory.jl.jsonDatabase(result, ["table_name", "table_type"]);
            // deze.tableProperties= new factory.aObject(result,["table_name","table_type"]);
            // deze.jsonDbTableProp= new factory.jsonDatabase(result,["table_name","table_type"]);
            deze.callback(deze.server);
        });
    };
    daoSQLite.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertStatement(tableName, columnProperties, request);
        return new Promise(function (resolve, reject) {
            _this.database.run(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("" + this.lastID);
                console.log("lastID " + this.lastID);
            });
        });
    };
    daoSQLite.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.database.run(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("{result: 1}");
                console.log("result: 1");
            });
        });
    };
    daoSQLite.prototype.AsyncPatchId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.database.run(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("1");
                console.log("result: 1");
            });
        });
    };
    daoSQLite.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.database.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    daoSQLite.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.database.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    daoSQLite.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.database.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    daoSQLite.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.database.all(sql, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };
    return daoSQLite;
}(factory_1.factory.AbstractDaoSupport));
exports.daoSQLite = daoSQLite;
//# sourceMappingURL=daoSQLite.js.map