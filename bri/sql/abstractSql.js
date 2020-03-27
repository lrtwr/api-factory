"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractSQL = /** @class */ (function () {
    function AbstractSQL() {
        this.GetSelectWithIdStatement = function (requestInfo, identityColumn, id) {
            return "select * from " + requestInfo.tableName + " where " + identityColumn + " = '" + id + "';";
        };
    }
    AbstractSQL.prototype.GetDeleteWithIdStatement = function (requestInfo, identityColumn, id) {
        return "Delete from " + requestInfo.tableName + " where " + identityColumn + " = " + id + ";";
    };
    AbstractSQL.prototype.GetIdExistStatement = function (requestInfo, identityColumn, id) {
        return "SELECT " + identityColumn + " FROM " + requestInfo.tableName + " where " + identityColumn + " = " + id;
    };
    AbstractSQL.prototype.GetCountStatement = function (requestInfo) {
        return "SELECT COUNT(*) AS count FROM " + requestInfo.tableName;
    };
    AbstractSQL.prototype.GetCountSelectRequestInfo = function (requestInfo) {
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        selectPart = "SELECT COUNT(*) AS count FROM " + requestInfo.tableName;
        if (requestInfo.sqlwhere)
            wherePart = " where " + requestInfo.sqlwhere;
        if (requestInfo.sqlorder)
            orderPart = " order by " + requestInfo.sqlorder;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    AbstractSQL.prototype.GetSelectFromRequestInfo = function (requestInfo) {
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        if (requestInfo.sqlselect.trim() == "")
            requestInfo.sqlselect = "*";
        selectPart = "Select " + requestInfo.sqlselect + " from " + requestInfo.tableName;
        if (requestInfo.sqlwhere)
            wherePart = " where " + requestInfo.sqlwhere;
        if (requestInfo.sqlorder)
            orderPart = " order by " + requestInfo.sqlorder;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    AbstractSQL.prototype.GetUpdateFromBodyStatement = function (requestInfo, id, identityColumn, tableColumnProperties, updateInfo, lDelimiter, rDelimiter) {
        if (lDelimiter === void 0) { lDelimiter = "'"; }
        if (rDelimiter === void 0) { rDelimiter = "'"; }
        var sql = "Update " + lDelimiter + requestInfo.tableName + rDelimiter + " Set ";
        var setArray = [];
        var pkDataType = "";
        var pkDelimiter = "";
        for (var i = 0; i < tableColumnProperties.length; i++) {
            var prop = tableColumnProperties[i];
            if (prop.column_name == identityColumn)
                pkDataType = prop.data_type;
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push(lDelimiter + prop.column_name + rDelimiter + "=");
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
        switch (pkDataType) {
            case "TEXT":
            case "UNIQUEIDENTIFIER":
            case "NVARCHAR":
            case "VARCHAR":
                pkDelimiter = "'";
                break;
        }
        return (sql +
            setArray.join(", ") +
            (" Where " + identityColumn + "=" + pkDelimiter + id + pkDelimiter));
    };
    AbstractSQL.prototype.GetUpdateStatement = function (requestInfo, identityColumn, tableColumnProperties, request) {
        var sql = "Update " + requestInfo.tableName + " Set ";
        var setArray = [];
        var updateInfo = request.body.update != null ? request.body.update : {};
        for (var i = 0; i < tableColumnProperties.length; i++) {
            var prop = tableColumnProperties[i];
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push("'" + prop.column_name + "' = ");
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
    AbstractSQL.prototype.GetInsertStatement = function (requestInfo, body, columnProperties, ldelimiter, rdelimiter) {
        if (ldelimiter === void 0) { ldelimiter = "["; }
        if (rdelimiter === void 0) { rdelimiter = "]"; }
        var sql = "Insert into " + requestInfo.tableName + " ";
        var asqlColumns = [];
        var asqlValues = [];
        var primaryKey;
        var insertInfo = body;
        for (var i = 0; i < columnProperties.length; i++) {
            var prop = columnProperties[i];
            if (prop.column_is_pk == 1)
                primaryKey = prop.column_name;
            if (insertInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    asqlColumns.push(prop.column_name);
                    switch (prop.data_type.toUpperCase()) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            insertInfo[prop.column_name] = insertInfo[prop.column_name].replace("'", "''");
                        case "DATE":
                            asqlValues.push("'" + insertInfo[prop.column_name] + "'");
                            break;
                        case "BOOL":
                        case "BOOLEAN":
                        case "TINYINT":
                        case "FLOAT":
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
        return (sql + "(" + ldelimiter + asqlColumns.join(rdelimiter + "," + ldelimiter) +
            rdelimiter + ") Values (" + asqlValues.join(", ") + ")");
    };
    return AbstractSQL;
}());
exports.AbstractSQL = AbstractSQL;
//# sourceMappingURL=abstractSql.js.map