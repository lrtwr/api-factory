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
var MSSQLStatements = /** @class */ (function (_super) {
    __extends(MSSQLStatements, _super);
    function MSSQLStatements() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MSSQLStatements.prototype.CreateTable = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    MSSQLStatements.prototype.DeleteTable = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    MSSQLStatements.prototype.CreateColumn = function (requestInfo) {
        throw new Error("Method not implemented.");
    };
    // static GetSelectStatement(tableName) {
    //   return `select * from ${tableName};`;
    // }
    MSSQLStatements.GetMSSQLTableColumnInfoStatement = function () {
        return "SELECT \n      n.name as table_name, \n  n.table_type,\n      c.name as column_name, \n      c. is_identity as column_is_pk, \n      UPPER(s.name) as data_type \n      from (select name, type_desc, object_id, 'table' as table_type from sys.tables where name <> '__EFMigrationsHistory'\n      union \n    select name, type_desc, object_id, 'view' as table_type from sys.views) n \n      left outer join sys.columns c \n        on n.object_id = c.object_id  \n        join sys.systypes s \n        on c.system_type_id = s.xtype \n        where s.name <> 'sysname' ";
    };
    return MSSQLStatements;
}(abstractSql_1.AbstractSQL));
exports.MSSQLStatements = MSSQLStatements;
//# sourceMappingURL=MSSQLStatements.js.map