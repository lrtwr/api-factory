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
var SQLiteStatements_1 = require("../sql/SQLiteStatements");
var enums_1 = require("../base/enums");
var sqlite3 = require("sqlite3");
var AbstractDao_1 = require("./AbstractDao");
var jsonDB_1 = require("../base/jsonDB");
sqlite3.verbose();
var DaoSQLite = /** @class */ (function (_super) {
    __extends(DaoSQLite, _super);
    function DaoSQLite(server, setupCallback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.setupCallback = setupCallback;
        _this.executeSql = null;
        _this.executeRun = function (sql, callback) {
            var goOn = true;
            _this.open(function (error) { if (error) {
                callback(error);
                goOn = false;
            } });
            if (!goOn)
                return;
            _this.db.run(sql, callback);
            _this.db.close(function (error) { if (error)
                callback(error); });
        };
        _this.executeAll = function (sql, callback) {
            var goOn = true;
            _this.open(function (error) { if (error) {
                callback(error);
                goOn = false;
            } });
            if (!goOn)
                return;
            _this.db.all(sql, callback);
            _this.db.close(function (error) { if (error)
                callback(error); });
        };
        _this.config = server.config;
        _this.status = server.status;
        _this.sqlStatements = new SQLiteStatements_1.SQLiteStatements();
        return _this;
    }
    DaoSQLite.prototype.connect = function (callback) {
        var self = this;
        this.status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
        var _error;
        if (this.config.databaseType == enums_1.enumDatabaseType.SQLiteMemory) {
            this.db = new sqlite3.Database(this.config.database, null, function (error) {
                if (error) {
                    _error = error;
                }
            });
        }
        else {
            this.db = new sqlite3.Database(this.config.database, sqlite3.OPEN_READWRITE, function (error) {
                if (error) {
                    _error = error;
                }
            });
        }
        if (_error) {
            if (callback)
                callback(_error);
            return;
        }
        self.getDbInfo(function (error) {
            if (error) {
                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                self.server.addError(error);
                if (callback)
                    callback(error);
            }
            else {
                self.setupCallback(null, self.server.routing);
                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                console.log("Connected to SQLite database: `" + self.config.database + "` on process:" + process.pid + ".");
                if (callback)
                    callback(null);
            }
        });
    };
    DaoSQLite.prototype.open = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.config.databaseType == enums_1.enumDatabaseType.SQLiteMemory)
                    return [2 /*return*/];
                this.db = new sqlite3.Database(this.config.database, null, function (error) {
                    if (callback) {
                        if (error)
                            callback(error);
                        else
                            callback(null);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    DaoSQLite.prototype.getDbInfo = function (callback) {
        var sql = this.sqlStatements.tableColumnInfo(this.config.database);
        var self = this;
        this.executeAll(sql, function (error, result) {
            var tmp = [];
            result.forEach(function (row) {
                row.table_name = row.table_name.toLowerCase();
                if (row.table_name != "sqlite_sequence")
                    tmp.push(row);
                1;
            });
            self.dbInfo = new jsonDB_1.ColumnPropertyJDB(tmp);
            if (callback) {
                if (error)
                    callback(error);
                callback(null);
            }
        });
    };
    DaoSQLite.prototype.createTable = function (requestInfo, callback) {
        var _this = this;
        var tableProp = this.columnProperties(requestInfo);
        var sql = this.sqlStatements.createTable(requestInfo);
        this.executeRun(sql, function (error) {
            if (error)
                callback(error);
            else {
                _this.getDbInfo(function (error) {
                    if (error)
                        callback(error);
                    tableProp = _this.columnProperties(requestInfo);
                    callback(null, tableProp != null);
                });
            }
        });
    };
    DaoSQLite.prototype.deleteTable = function (requestInfo, callback) {
        var _this = this;
        var sql = this.sqlStatements.deleteTable(requestInfo);
        this.executeRun(sql, function (error) {
            if (error)
                callback(error);
            _this.getDbInfo(function (error) {
                if (error)
                    callback(error);
                var tableProp = _this.columnProperties(requestInfo);
                callback(null, tableProp != null);
            });
        });
    };
    DaoSQLite.prototype.createColumn = function (requestInfo, callback) {
        var _this = this;
        var tableProp = this.models();
        if (tableProp[requestInfo.tableName][requestInfo.columnName])
            callback(null, "Column '" + requestInfo.columnName + " from table " + (requestInfo.tableName) + "' already exists.");
        else {
            var sql = this.sqlStatements.createColumn(requestInfo);
            this.executeRun(sql, function (error, result) {
                if (error)
                    callback(error);
                _this.getDbInfo(function (error) {
                    if (error)
                        callback(error);
                    tableProp = _this.models();
                    callback(null, tableProp[requestInfo.tableName][requestInfo.columnName] != null);
                });
            });
        }
    };
    DaoSQLite.prototype.createForeignKey = function (requestInfo, callback) {
        requestInfo.columnName = requestInfo.targetTable + "Id";
        var columnProp = this.columnProperties(requestInfo);
        requestInfo.dataType = columnProp[0].data_type;
        return this.createColumn(requestInfo, function (error, result) {
            callback(error, result);
        });
    };
    DaoSQLite.prototype.updateItem = function (requestInfo, id, body, callback) {
        var columnProperties = this.columnProperties(requestInfo);
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.updateWithIdFromBody(requestInfo, id, identityColumn, columnProperties, body);
        this.executeRun(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, requestInfo.id);
            else
                callback(null, requestInfo.id);
        });
    };
    DaoSQLite.prototype.updateAll = function (requestInfo, body, callback) {
        var columnProperties = this.columnProperties(requestInfo);
        var sql = this.sqlStatements.updateFromBody(requestInfo, columnProperties, body);
        this.executeRun(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, requestInfo.id);
            else
                callback(null, requestInfo.id);
        });
    };
    DaoSQLite.prototype.addItem = function (requestInfo, body, callback) {
        var columnProperties = this.columnProperties(requestInfo);
        var sql = this.sqlStatements.insert(requestInfo, body, columnProperties, "[", "]");
        this.executeRun(sql, function (error, result) {
            if (error)
                callback(error);
            else
                callback(null, "" + this.lastID);
        });
    };
    DaoSQLite.prototype.getAllItems = function (requestInfo, callback) {
        var sql = this.sqlStatements.selectFromRequestInfo(requestInfo);
        this.executeAll(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result);
        });
    };
    DaoSQLite.prototype.countItems = function (requestInfo, callback) {
        var sql = this.sqlStatements.countSelectRequestInfo(requestInfo);
        this.executeAll(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result);
            else
                callback(null, 0);
        });
    };
    DaoSQLite.prototype.getItem = function (requestInfo, itemId, callback) {
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.selectWithId(requestInfo, identityColumn, itemId);
        this.executeAll(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result);
        });
    };
    DaoSQLite.prototype.itemExists = function (requestInfo, itemId, callback) {
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.idExist(requestInfo, identityColumn, itemId);
        this.executeAll(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(result);
        });
    };
    DaoSQLite.prototype.deleteItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var identityColumn, sql;
            return __generator(this, function (_a) {
                identityColumn = this.primaryKeyColumnName(requestInfo);
                sql = this.sqlStatements.deleteWithId(requestInfo, identityColumn, itemId);
                this.executeRun(sql, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, itemId);
                    else
                        callback(null, itemId);
                });
                return [2 /*return*/];
            });
        });
    };
    return DaoSQLite;
}(AbstractDao_1.AbstractDao));
exports.DaoSQLite = DaoSQLite;
//# sourceMappingURL=daoSQLite.js.map