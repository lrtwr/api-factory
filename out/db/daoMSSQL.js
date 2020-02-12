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
var ApiSQLStatements_1 = require("../base/ApiSQLStatements");
var mssql = require("mssql");
var enums_1 = require("../base/enums");
var abstracts_1 = require("../base/abstracts");
var factory_1 = require("../base/factory");
var DaoMSSQL = /** @class */ (function (_super) {
    __extends(DaoMSSQL, _super);
    function DaoMSSQL(server, config, status, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
        console.log("connecting");
        _this.dbConnect();
        return _this;
    }
    DaoMSSQL.prototype.dbConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, mssql.connect(this.config)];
                    case 1:
                        _a.sent();
                        this.db = mssql;
                        return [4 /*yield*/, mssql.query(ApiSQLStatements_1.ApiSQLStatements.GetMSSQLTableColumnInfoStatement())];
                    case 2:
                        result = _a.sent();
                        this.tableProperties = new factory_1.JsonDatabase(result.recordset, ["table_name", "table_type"]);
                        this.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                        console.log("Connected to MSSQL: `" + this.config.database + "`!");
                        this.callback(this.server.routing);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.server.lastErrors.push(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DaoMSSQL.prototype.AsyncPost = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetInsertStatement(tableName, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql + ";SELECT SCOPE_IDENTITY() as LastID;", function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve(result.recordset[0].LastID);
                console.log(result.recordset[0]);
            });
        });
    };
    DaoMSSQL.prototype.AsyncDeleteId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetDeleteWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve(result.rowsAffected);
            });
        });
    };
    DaoMSSQL.prototype.AsyncPatchId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetUpdateStatement(tableName, identityColumn, this.GetColumnProperties(tableName), request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    console.log(error.message);
                    reject(error);
                }
                resolve(result.rowsAffected);
            });
        });
    };
    DaoMSSQL.prototype.AsyncGet = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result.recordset);
            });
        });
    };
    DaoMSSQL.prototype.AsyncExistId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetIdExistStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result.recordset);
            });
        });
    };
    DaoMSSQL.prototype.AsyncGetId = function (tableName, request) {
        var _this = this;
        var identityColumn = this.GetPrimarayKeyColumnName(tableName);
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetSelectWithIdStatement(tableName, identityColumn, request.params.id);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result.recordset);
            });
        });
    };
    DaoMSSQL.prototype.AsyncCount = function (tableName, request) {
        var _this = this;
        var sql = ApiSQLStatements_1.ApiSQLStatements.GetCountSelectFromJsonBody(tableName, request);
        return new Promise(function (resolve, reject) {
            _this.db.query(sql, function (error, result) {
                if (error) {
                    reject(error);
                }
                if (result)
                    resolve(result.recordset);
            });
        });
    };
    return DaoMSSQL;
}(abstracts_1.AbstractDaoSupport));
exports.DaoMSSQL = DaoMSSQL;
//# sourceMappingURL=daoMSSQL.js.map