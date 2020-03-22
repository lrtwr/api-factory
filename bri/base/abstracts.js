"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractResponseDirector = /** @class */ (function () {
    function AbstractResponseDirector() {
    }
    return AbstractResponseDirector;
}());
exports.AbstractResponseDirector = AbstractResponseDirector;
var AbstractDaoSupport = /** @class */ (function () {
    function AbstractDaoSupport(self) {
        var _this = this;
        this.self = self;
        this.GetViewNames = function () {
            if (!_this.tableProperties.db.table_type)
                return [];
            else if (!_this.tableProperties.db.table_type.view)
                return [];
            return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.view, "table_name");
        };
    }
    AbstractDaoSupport.prototype.GetColumnProperties = function (tableName) {
        if (this.tableProperties.db.table_name)
            return this.tableProperties.db.table_name[tableName];
    };
    AbstractDaoSupport.prototype.GetPrimaryKeyColumnName = function (tableName) {
        var ret;
        this.tableProperties.db.table_name[tableName].forEach(function (column) {
            if (column.column_is_pk) {
                ret = column.column_name;
            }
        });
        return ret;
    };
    AbstractDaoSupport.prototype.GetPrimaryKeys = function (tableName) {
        var _this = this;
        var ret = {};
        var tables = this.GetTableNames();
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
    AbstractDaoSupport.prototype.GetModels = function (tableName) {
        var _this = this;
        var tables = this.GetTableNames();
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
    AbstractDaoSupport.prototype.GetTableNames = function () {
        if (!this.tableProperties.db.table_type)
            return [];
        else if (!this.tableProperties.db.table_type.table)
            return [];
        return this.tableProperties.GetPropArray(this.tableProperties.db.table_type.table, "table_name");
    };
    ;
    return AbstractDaoSupport;
}());
exports.AbstractDaoSupport = AbstractDaoSupport;
//# sourceMappingURL=abstracts.js.map