"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiSQLStatements = /** @class */ (function () {
    function ApiSQLStatements() {
    }
    // static GetSelectStatement(tableName) {
    //   return `select * from ${tableName};`;
    // }
    ApiSQLStatements.GetSelectWithIdStatement = function (tableName, identityColumn, id) {
        return "select * from " + tableName + " where " + identityColumn + " = " + id + ";";
    };
    ApiSQLStatements.GetDeleteWithIdStatement = function (tableName, identityColumn, id) {
        return "Delete from " + tableName + " where " + identityColumn + " = " + id + ";";
    };
    ApiSQLStatements.GetIdExistStatement = function (tableName, identityColumn, id) {
        return "SELECT " + identityColumn + " FROM " + tableName + " where " + identityColumn + " = " + id;
    };
    ApiSQLStatements.GetCountStatement = function (tableName) {
        return "SELECT COUNT(*) AS count FROM " + tableName;
    };
    ApiSQLStatements.GetMySQLTableColumnInfoStatement = function (databaseName) {
        return "Select \n    col.table_schema as table_schema,\n    case \n   when vie.table_type = 'BASE TABLE' then 'table' \n   when vie.table_type = 'VIEW' then 'view' \n   else 'other' \n   end as table_type,\n    col.table_name as table_name, \n    col.column_name as column_name, \n    col.column_default as default_val, \n    col.is_nullable = \"YES\" as is_nullable, \n    upper(col.data_type) as data_type, \n    col.column_key='PRI' as column_is_pk  \n    FROM information_schema.columns col \njoin information_schema.tables vie on vie.table_schema = col.table_schema\n                              and vie.table_name = col.table_name\nwhere col.table_schema not in ('sys','information_schema',\n                           'mysql', 'performance_schema')\nand vie.table_schema = '" + databaseName + "' \norder by col.table_name, col.ordinal_position;\n";
    };
    ApiSQLStatements.GetSQLiteTableColumnInfoStatement = function () {
        return "SELECT m.name AS table_name, \n    p.name AS column_name,\n    m.type As table_type,\n    p.type AS data_type,\n\tp.pk AS column_is_pk\n  FROM sqlite_master m\n  JOIN pragma_table_info((m.name)) p\nWHERE table_name <> 'sqlite_sequence'\n  ORDER BY table_name";
    };
    ApiSQLStatements.GetMSSQLTableColumnInfoStatement = function () {
        return "SELECT \n    n.name as table_name, \nn.table_type,\n    c.name as column_name, \n    c. is_identity as column_is_pk, \n    UPPER(s.name) as data_type \n    from (select name, type_desc, object_id, 'table' as table_type from sys.tables where name <> '__EFMigrationsHistory'\n    union \n  select name, type_desc, object_id, 'view' as table_type from sys.views) n \n    left outer join sys.columns c \n      on n.object_id = c.object_id  \n      join sys.systypes s \n      on c.system_type_id = s.xtype \n      where s.name <> 'sysname' ";
    };
    ApiSQLStatements.GetCountSelectFromJsonBody = function (tableName, request) {
        var body = request.body;
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        var where = body["where"];
        var order = body["order"];
        var pageLength = body["pagelength"];
        var pageNumber = body["pagenumber"];
        selectPart = "SELECT COUNT(*) AS count FROM " + tableName;
        if (where)
            wherePart = " where " + where;
        if (order)
            orderPart = " order by " + order;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    ApiSQLStatements.GetSelectFromJsonBody = function (tableName, request) {
        var body = request.body;
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        var select = "";
        var where = "";
        var order = "";
        if (body["select"] != null)
            select = body["select"];
        if (body["where"] != null)
            where = body["where"];
        if (body["order"] != null)
            order = body["order"];
        var pageLength = body["pagelength"];
        var pageNumber = body["pagenumber"];
        if (select.trim() == "")
            select = "*";
        selectPart = "Select " + select + " from " + tableName;
        if (where)
            wherePart = " where " + where;
        if (order)
            orderPart = " order by " + order;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    ApiSQLStatements.GetUpdateStatement = function (tableName, identityColumn, tableColumnProperties, request) {
        var sql = "Update " + tableName + " Set ";
        var setArray = [];
        var updateInfo = request.body.update != null ? request.body.update : {};
        for (var i = 0; i < tableColumnProperties.length; i++) {
            var prop = tableColumnProperties[i];
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push(prop.column_name + " = ");
                    switch (prop.data_type) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            setArray[setArray.length - 1] +=
                                "'" + updateInfo[prop.column_name] + "'";
                            break;
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            setArray[setArray.length - 1] += updateInfo[prop.column_name];
                            break;
                    }
                }
            }
        }
        return (sql +
            setArray.join(", ") +
            (" Where " + identityColumn + "=" + request.params.id));
    };
    ApiSQLStatements.GetInsertStatement = function (tableName, columnProperties, request) {
        var sql = "Insert into " + tableName + " ";
        var asqlColumns = [];
        var asqlValues = [];
        var sqlColumns = "";
        var sqlValues = "";
        var insertInfo = {};
        if (request.body.update)
            insertInfo = request.body.update;
        if (request.body.insert)
            insertInfo = request.body.insert;
        // Jeroen wat te doen bij {} dus geen insert/update info
        for (var i = 0; i < columnProperties.length; i++) {
            var prop = columnProperties[i];
            if (insertInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    asqlColumns.push(prop.column_name);
                    switch (prop.data_type) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            asqlValues.push("'" + insertInfo[prop.column_name] + "'");
                            break;
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            asqlValues.push(insertInfo[prop.column_name]);
                            break;
                    }
                }
            }
        }
        return (sql +
            "(" +
            asqlColumns.join(", ") +
            ") Values (" +
            asqlValues.join(", ") +
            ")");
    };
    return ApiSQLStatements;
}());
exports.ApiSQLStatements = ApiSQLStatements;
//# sourceMappingURL=ApiSQLStatements.js.map