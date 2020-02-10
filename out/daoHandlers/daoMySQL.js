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
var ApiSQLStatements_1 = require("../setup/ApiSQLStatements");
var factory_1 = require("../setup/factory");
var daoMySQL = /** @class */ (function (_super) {
    __extends(daoMySQL, _super);
    function daoMySQL(server, config, status, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        status.DbConnect = factory_1.factory.enums.enumRunningStatus.DbConnectInitializing;
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
                _this.lastErrors.push(error);
                throw error;
            }
            var sql = ApiSQLStatements_1.ApiSQLStatements.GetMySQLTableColumnInfoStatement(_this.config.database);
            db.query(sql, function (error, result) {
                if (error) {
                    _this.lastErrors.push(error);
                    throw error;
                }
                self.tableProperties = new factory_1.factory.jl.jsonDatabase(result, [
                    "table_name",
                    "table_type"
                ]);
                console.log("Connected to MySQL: `" + _this.config.database + "`!");
                _this.status.DbConnect = factory_1.factory.enums.enumRunningStatus.DbConnectConnected;
                self.callback(self.server);
            });
        });
        return _this;
    }
    daoMySQL.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertStatement(tableName, columnProperties, request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result, fields) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("" + result.insertId);
                console.log("lastID " + result.insertId);
            });
        });
    };
    daoMySQL.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("1");
                console.log("1 updated");
            });
        });
    };
    daoMySQL.prototype.AsyncPatchId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve("1");
                console.log("1 updated");
            });
        });
    };
    daoMySQL.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    };
    daoMySQL.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    };
    daoMySQL.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    };
    daoMySQL.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result);
            });
        });
    };
    return daoMySQL;
}(factory_1.factory.abstracts.AbstractDaoSupport));
exports.daoMySQL = daoMySQL;
//# sourceMappingURL=daoMySQL.js.map