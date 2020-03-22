"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDao = /** @class */ (function () {
    function AbstractDao() {
    }
    AbstractDao.prototype.tableExists = function (requestInfo) {
        if (this.tableProperties.db.table_name) {
            return (this.tableProperties.db.table_name[requestInfo.tableName]) ? true : false;
        }
        else
            return false;
    };
    AbstractDao.prototype.columnProperties = function (requestInfo) {
        if (this.tableProperties.db.table_name)
            return this.tableProperties.db.table_name[requestInfo.unitId];
        return null;
    };
    AbstractDao.prototype.primaryKeyColumnName = function (requestInfo) {
        var ret;
        this.tableProperties.db.table_name[requestInfo.unitId].forEach(function (column) {
            if (column.column_is_pk) {
                ret = column.column_name;
            }
        });
        return ret;
    };
    AbstractDao.prototype.primaryKeys = function (tableName) {
        var _this = this;
        var ret = {};
        var tables = this.tableNames();
        tables.forEach(function (table) {
            _this.tableProperties.db.table_name[table].forEach(function (column) {
                if (!tableName || tableName == table) {
                    if (column.column_is_pk)
                        ret[table] = column.column_name;
                }
            });
        });
        return ret;
    };
    AbstractDao.prototype.models = function (tableName) {
        var _this = this;
        var tables = this.tableNames();
        var ret = {};
        var columns;
        var model;
        tables.forEach(function (table) {
            model = {};
            if (!tableName || tableName == table) {
                _this.tableProperties.db.table_name[table].forEach(function (column) {
                    model[column.column_name] = column.data_type;
                });
                ret[table] = model;
            }
        });
        return ret;
    };
    AbstractDao.prototype.tableNames = function () {
        if (!this.tableProperties.db.table_type)
            return [];
        else if (!this.tableProperties.db.table_type.table)
            return [];
        return this.tableProperties.GetPropArray(this.tableProperties.db.table_type.table, "table_name");
    };
    ;
    AbstractDao.prototype.viewNames = function () {
        if (!this.tableProperties.db.table_type)
            return [];
        else if (!this.tableProperties.db.table_type.view)
            return [];
        return this.tableProperties.GetPropArray(this.tableProperties.db.table_type.view, "table_name");
    };
    ;
    return AbstractDao;
}());
exports.AbstractDao = AbstractDao;
//# sourceMappingURL=AbstractDao.js.map