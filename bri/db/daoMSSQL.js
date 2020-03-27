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
        _this.executeSqlOld = function (sql, callback) { return _this.db.query(sql, callback); };
        _this.executeSql = function (sql, callback) {
            var self = _this;
            _this.db.connect()
                .then(function (conn) {
                conn.query(sql)
                    .then(function (result) { return callback(null, result); })
                    .then(function () { return conn.close(); })
                    .catch(function (error) {
                    conn.close();
                    callback(error);
                });
            });
        };
        _this.config = server.config;
        _this.status = server.status;
        _this.sqlStatements = new MSSQLStatements_1.MSSQLStatements();
        ;
        return _this;
    }
    DaoMSSQL.prototype.connect = function () {
        var _this = this;
        var self = this;
        //this.db = mssql;
        mssql.on('error', function (error) {
            self.server.addError(error);
        });
        this.db = new mssql.ConnectionPool(this.config);
        this.getDbInfo(function (error, result) {
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
        var sql = this.sqlStatements.GetSelectFromRequestInfo(requestInfo);
        this.executeSql(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result.recordset);
        });
    };
    DaoMSSQL.prototype.getItem = function (requestInfo, itemId, callback) {
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.GetSelectWithIdStatement(requestInfo, identityColumn, itemId);
        this.executeSql(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result.recordset);
        });
    };
    DaoMSSQL.prototype.countItems = function (requestInfo, callback) {
        var sql = this.sqlStatements.GetCountSelectRequestInfo(requestInfo);
        this.executeSql(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result.recordset.length);
            callback(null, 0);
        });
    };
    DaoMSSQL.prototype.addItem = function (requestInfo, body, callback) {
        var columnProperties = this.columnProperties(requestInfo);
        var sql = this.sqlStatements.GetInsertStatement(requestInfo, body, columnProperties, "[", "]");
        this.executeSql(sql, function (error, result) {
            callback(error, result.recordset);
        });
    };
    DaoMSSQL.prototype.updateItem = function (requestInfo, id, body, callback) {
        var columnProperties = this.columnProperties(requestInfo);
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.GetUpdateFromBodyStatement(requestInfo, id, identityColumn, columnProperties, body, "[", "]");
        this.executeSql(sql, function (error, result) {
            callback(error, requestInfo.id);
            // if (error) callback(error);
            // if (result) callback(null, id);
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
        var identityColumn = this.primaryKeyColumnName(requestInfo);
        var sql = this.sqlStatements.GetDeleteWithIdStatement(requestInfo, identityColumn, itemId);
        this.db.query(sql, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result.rowsAffected);
        });
    };
    return DaoMSSQL;
}(AbstractDao_1.AbstractDao));
exports.DaoMSSQL = DaoMSSQL;
//# sourceMappingURL=daoMSSQL.js.map