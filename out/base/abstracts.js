"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractApiHandler = /** @class */ (function () {
    function AbstractApiHandler() {
    }
    return AbstractApiHandler;
}());
exports.AbstractApiHandler = AbstractApiHandler;
var AbstractDaoSupport = /** @class */ (function () {
    function AbstractDaoSupport() {
        var _this = this;
        this.GetTableNames = function () {
            if (!_this.tableProperties.db.table_type)
                return [];
            else if (!_this.tableProperties.db.table_type.table)
                return [];
            return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.table, "table_name");
        };
        this.GetViewNames = function () {
            if (!_this.tableProperties.db.table_type)
                return [];
            else if (!_this.tableProperties.db.table_type.view)
                return [];
            return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.view, "table_name");
        };
    }
    AbstractDaoSupport.prototype.GetColumnProperties = function (tableName) {
        return this.tableProperties.db.table_name[tableName];
    };
    AbstractDaoSupport.prototype.GetPrimarayKeyColumnName = function (tableName) {
        var ret;
        this.tableProperties.db.table_name[tableName].forEach(function (column) {
            if (column.column_is_pk) {
                ret = column.column_name;
            }
        });
        return ret;
    };
    return AbstractDaoSupport;
}());
exports.AbstractDaoSupport = AbstractDaoSupport;
//# sourceMappingURL=abstracts.js.map