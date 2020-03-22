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
var abstractSql_1 = require("../db/abstractSql");
var MySQLStatements = /** @class */ (function (_super) {
    __extends(MySQLStatements, _super);
    function MySQLStatements() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MySQLStatements.prototype.CreateTable = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    MySQLStatements.prototype.DeleteTable = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    MySQLStatements.prototype.CreateColumn = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    MySQLStatements.GetMySQLTableColumnInfoStatement = function (databaseName) {
        return "Select \n      col.table_schema as table_schema,\n      case \n     when vie.table_type = 'BASE TABLE' then 'table' \n     when vie.table_type = 'VIEW' then 'view' \n     else 'other' \n     end as table_type,\n      col.table_name as table_name, \n      col.column_name as column_name, \n      col.column_default as default_val, \n      col.is_nullable = \"YES\" as is_nullable, \n      upper(col.data_type) as data_type, \n      col.column_key='PRI' as column_is_pk  \n      FROM information_schema.columns col \n  join information_schema.tables vie on vie.table_schema = col.table_schema\n                                and vie.table_name = col.table_name\n  where col.table_schema not in ('sys','information_schema',\n                             'mysql', 'performance_schema')\n  and vie.table_schema = '" + databaseName + "' \n  order by col.table_name, col.ordinal_position;\n  ";
    };
    return MySQLStatements;
}(abstractSql_1.AbstractSQL));
exports.MySQLStatements = MySQLStatements;
//# sourceMappingURL=MySQLStatements.js.map