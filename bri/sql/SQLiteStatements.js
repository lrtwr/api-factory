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
var abstractSql_1 = require("./abstractSql");
var SQLiteStatements = /** @class */ (function (_super) {
    __extends(SQLiteStatements, _super);
    function SQLiteStatements() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SQLiteStatements.prototype.tableColumnInfo = function () {
        return "SELECT m.name AS table_name, \n    p.name AS column_name,\n    m.type As table_type,\n    p.type AS data_type,\n\tp.pk AS column_is_pk\n  FROM sqlite_master m\n  JOIN pragma_table_info((m.name)) p";
    };
    SQLiteStatements.prototype.createTable = function (requestInfo) {
        return "CREATE TABLE IF NOT EXISTS '" + requestInfo.tableName + "' (\n    \"Id\"\tINTEGER PRIMARY KEY AUTOINCREMENT\n  )";
    };
    SQLiteStatements.prototype.deleteTable = function (requestInfo) {
        return "DROP TABLE IF EXISTS '" + requestInfo.tableName + "'";
    };
    SQLiteStatements.prototype.createColumn = function (requestInfo) {
        var tableName = requestInfo.tableName;
        var columnName = requestInfo.columnName;
        var columnType;
        switch (requestInfo.dataType.toLowerCase()) {
            case 'string':
            case 'text':
            case 'varchar':
            case 'nvarchar':
                columnType = "TEXT";
                break;
            case 'integer':
            case 'int':
                columnType = "INTEGER";
                break;
            case 'number':
                columnType = "REAL";
                break;
            case 'bool':
            case 'boolean':
                columnType = "BOOLEAN";
                break;
            case 'datetime':
            case 'date':
                columnType = "date";
                break;
            default:
                columnType = "TEXT";
                break;
        }
        return "ALTER TABLE \"" + tableName + "\" \n    ADD COLUMN \"" + columnName + "\" " + columnType + " null";
    };
    return SQLiteStatements;
}(abstractSql_1.AbstractSQL));
exports.SQLiteStatements = SQLiteStatements;
//# sourceMappingURL=SQLiteStatements.js.map