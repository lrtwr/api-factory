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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var ApiSQLStatements_1 = require("../setup/ApiSQLStatements");
var factory_1 = require("../setup/factory");
var daoMySQL = /** @class */ (function (_super) {
    __extends(daoMySQL, _super);
    function daoMySQL(server, config, status, callback) {
        var _this = _super.call(this, status) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        _this.AsyncConnect();
        return _this;
    }
    daoMySQL.prototype.dbConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deze, db, res1, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deze = this;
                        db = mysql.createConnection({
                            host: this.config.host,
                            user: this.config.user,
                            password: this.config.password,
                            database: this.config.database
                        });
                        console.log("1");
                        db.connect();
                        this.database = db;
                        console.log("Connected to MySQL: `" + this.config.database + "`!");
                        this.status.DbConnect = factory_1.factory.enumRunningStatus.DbConnectConnected;
                        db.query("USE " + this.config.database, function (error, result) {
                            if (error)
                                console.log(error);
                            res1 = result;
                        });
                        console.log("3 USE " + this.config.database + " done");
                        sql = "USE " +
                            deze.config.database +
                            ";" +
                            ApiSQLStatements_1.ApiSQLStatements.GetMySQLTableColumnInfoStatement(this.config.database);
                        return [4 /*yield*/, db.query(sql, function (error, result) {
                                //deze.tableColumnProperties = result;
                                deze.tableProperties = new factory_1.factory.jl.jsonDatabase(result, ["table_name", "table_type"]);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    daoMySQL.prototype.AsyncConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deze;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deze = this;
                        console.log("0 connecting");
                        return [4 /*yield*/, this.dbConnect()];
                    case 1:
                        _a.sent();
                        deze.callback(deze.server);
                        console.log("6 mysql callback done.");
                        return [2 /*return*/];
                }
            });
        });
    };
    daoMySQL.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var columnProperties = this.GetColumnProperties(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertStatement(tableName, columnProperties, request);
        return new Promise(function (resolve, reject) {
            _this.database.query(sql, function (error, result, fields) {
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
            _this.database.query(sql, function (error, result) {
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
            _this.database.query(sql, function (error, result) {
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
            _this.database.query(sql, function (error, result) {
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
            _this.database.query(sql, function (error, result) {
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
            _this.database.query(sql, function (error, result) {
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
            _this.database.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result);
            });
        });
    };
    return daoMySQL;
}(factory_1.factory.AbstractDaoSupport));
exports.daoMySQL = daoMySQL;
//# sourceMappingURL=daoMySQL.js.map