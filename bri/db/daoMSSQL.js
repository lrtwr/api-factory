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
var enums_1 = require("../base/enums");
var AbstractDao_1 = require("./AbstractDao");
var custom_1 = require("../base/custom");
var MSSQLStatements_1 = require("../sql/MSSQLStatements");
var mssql = require('mssql');
var DaoMSSQL = /** @class */ (function (_super) {
    __extends(DaoMSSQL, _super);
    function DaoMSSQL(server, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.callback = callback;
        _this.executeSql = function (sql, callback) { return _this.db.query(sql, callback); };
        _this.config = server.config;
        _this.status = server.status;
        _this.sqlStatements = new MSSQLStatements_1.MSSQLStatements();
        ;
        return _this;
    }
    DaoMSSQL.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        this.db = mssql;
                        return [4 /*yield*/, mssql.on('error', function (error) {
                                self.server.addError(error);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mssql.connect(this.config, function (error) {
                                if (error)
                                    self.server.addError(error);
                                else {
                                }
                                _this.getDbInfo(function (error, result) {
                                    if (error) {
                                        self.server.addError(error);
                                        self.callback(error, null);
                                    }
                                    if (result) {
                                        if (result == "1") {
                                            self.callback(null, self.server.routing);
                                            _this.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                                            console.log("Connected to MSSQL: `" + _this.config.database + "` on process:" + process.pid + ".");
                                        }
                                    }
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoMSSQL.prototype.getDbInfo = function (callback) {
        var sql = this.sqlStatements.GetTableColumnInfoStatement();
        var self = this;
        this.executeSql(sql, function (error, result) {
            if (error)
                callback(error);
            if (result) {
                result.recordset.forEach(function (row) { row.table_name = row.table_name.toLowerCase(); });
                self.tableProperties = new custom_1.JsonDatabase(result.recordset, [
                    "table_name",
                    "table_type"
                ]);
            }
            if (callback)
                callback(null, "1");
        });
    };
    DaoMSSQL.prototype.createTable = function (requestInfo, callback) {
        var _this = this;
        var sql = this.sqlStatements.CreateTable(requestInfo);
        this.executeSql(sql, function (error, result) {
            if (error)
                callback(error);
            _this.getDbInfo(function (error) {
                if (error)
                    callback(error);
                else {
                    var tableProp = _this.columnProperties(requestInfo);
                    callback(null, tableProp != null);
                }
            });
        });
    };
    DaoMSSQL.prototype.deleteTable = function (requestInfo, callback) {
        var _this = this;
        var sql = this.sqlStatements.DeleteTable(requestInfo);
        this.executeSql(sql, function (error) {
            if (error)
                callback(error);
            _this.getDbInfo(function (error) {
                if (error)
                    callback(error);
                else {
                    var tableProp = _this.columnProperties(requestInfo);
                    callback(null, tableProp == null);
                }
            });
        });
    };
    DaoMSSQL.prototype.createColumn = function (requestInfo, callback) {
        var _this = this;
        var tableProp = this.models();
        if (tableProp[requestInfo.tableName][requestInfo.columnName])
            callback(null, "Column '" + requestInfo.columnName + " from table " + (requestInfo.tableName) + "' already exists.");
        else {
            var sql = this.sqlStatements.CreateColumn(requestInfo);
            this.executeSql(sql, function (error, result) {
                if (error)
                    callback(error);
                _this.getDbInfo(function (error, result) {
                    if (error)
                        callback(error);
                    else {
                        tableProp = _this.models();
                        callback(null, tableProp[requestInfo.tableName][requestInfo.columnName] != null);
                    }
                });
            });
        }
    };
    DaoMSSQL.prototype.createForeignKey = function (requestInfo, callback) {
        requestInfo.columnName = requestInfo.targetTable + "Id";
        var columnProp = this.columnProperties(requestInfo);
        if (!columnProp)
            callback(null, "Table '" + (requestInfo.tableName) + "' does not exists.");
        else {
            requestInfo.dataType = columnProp[0].data_type;
            return this.createColumn(requestInfo, function (error, result) {
                callback(error, result);
            });
        }
    };
    DaoMSSQL.prototype.getAllItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = this.sqlStatements.GetSelectFromRequestInfo(requestInfo);
                this.executeSql(sql, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result.recordset);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMSSQL.prototype.getItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var identityColumn, sql;
            return __generator(this, function (_a) {
                identityColumn = this.primaryKeyColumnName(requestInfo);
                sql = this.sqlStatements.GetSelectWithIdStatement(requestInfo, identityColumn, itemId);
                this.executeSql(sql, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result.recordset);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMSSQL.prototype.countItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = this.sqlStatements.GetCountSelectRequestInfo(requestInfo);
                this.executeSql(sql, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result.recordset.length);
                    callback(null, 0);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMSSQL.prototype.addItem = function (requestInfo, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var columnProperties, sql;
            return __generator(this, function (_a) {
                columnProperties = this.columnProperties(requestInfo);
                sql = this.sqlStatements.GetInsertStatement(requestInfo, body, columnProperties, "[", "]");
                this.executeSql(sql, function (error, result) {
                    callback(error, result.recordset);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMSSQL.prototype.updateItem = function (requestInfo, id, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var columnProperties, identityColumn, sql;
            return __generator(this, function (_a) {
                columnProperties = this.columnProperties(requestInfo);
                identityColumn = this.primaryKeyColumnName(requestInfo);
                sql = this.sqlStatements.GetUpdateFromBodyStatement(requestInfo, id, identityColumn, columnProperties, body);
                this.executeSql(sql, function (error, result) {
                    callback(error, requestInfo.id);
                    // if (error) callback(error);
                    // if (result) callback(null, id);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMSSQL.prototype.itemExists = function (requestInfo, itemId, callback) {
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.GetIdExistStatement(requestInfo, identityColumn, itemId);
        this.db.query(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(result.recordset);
        });
    };
    DaoMSSQL.prototype.deleteItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var identityColumn, sql;
            return __generator(this, function (_a) {
                identityColumn = this.primaryKeyColumnName(requestInfo);
                sql = this.sqlStatements.GetDeleteWithIdStatement(requestInfo, identityColumn, itemId);
                this.db.query(sql, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result.rowsAffected);
                });
                return [2 /*return*/];
            });
        });
    };
    return DaoMSSQL;
}(AbstractDao_1.AbstractDao));
exports.DaoMSSQL = DaoMSSQL;
//# sourceMappingURL=daoMSSQL.js.map