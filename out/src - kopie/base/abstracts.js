"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abstracts;
(function (abstracts) {
    var AbstractApiHandler = /** @class */ (function () {
        function AbstractApiHandler() {
            // super();
        }
        return AbstractApiHandler;
    }());
    abstracts.AbstractApiHandler = AbstractApiHandler;
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
            var ret_value;
            this.tableProperties.db.table_name[tableName].forEach(function (column) {
                if (column.column_is_pk) {
                    ret_value = column.column_name;
                }
            });
            return ret_value;
        };
        return AbstractDaoSupport;
    }());
    abstracts.AbstractDaoSupport = AbstractDaoSupport;
})(abstracts = exports.abstracts || (exports.abstracts = {}));
//# sourceMappingURL=abstracts.js.map