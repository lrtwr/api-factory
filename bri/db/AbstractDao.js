"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDao = /** @class */ (function () {
    function AbstractDao() {
        var _this = this;
        this.models = function (tableName) { return _this.dbInfo.models(tableName); };
        this.primaryKeys = function (tableName) { return _this.dbInfo.primaryKeys(tableName); };
        this.tableNames = function () { return _this.dbInfo.tableNames(); };
        this.viewNames = function () { return _this.dbInfo.viewNames(); };
        this.columnProperties = function (requestInfo) { return _this.dbInfo.columnProperties(requestInfo.tableName); };
        this.tableExists = function (requestInfo) { return _this.dbInfo.tableExists(requestInfo.tableName); };
        this.primaryKeyColumnName = function (requestInfo) { return _this.dbInfo.primaryKeyColumnName(requestInfo.tableName); };
    }
    return AbstractDao;
}());
exports.AbstractDao = AbstractDao;
//# sourceMappingURL=AbstractDao.js.map