"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("../base/factory");
var AbstractSQL = /** @class */ (function () {
    function AbstractSQL() {
    }
    AbstractSQL.prototype.CreateTable = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    AbstractSQL.prototype.DeleteTable = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    AbstractSQL.prototype.CreateColumn = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    AbstractSQL.GetDeleteWithIdStatement = function (tableName, identityColumn, id) {
        return "Delete from " + tableName + " where " + identityColumn + " = " + id + ";";
    };
    AbstractSQL.GetIdExistStatement = function (tableName, identityColumn, id) {
        return "SELECT " + identityColumn + " FROM " + tableName + " where " + identityColumn + " = " + id;
    };
    AbstractSQL.GetCountStatement = function (tableName) {
        return "SELECT COUNT(*) AS count FROM " + tableName;
    };
    AbstractSQL.GetCountSelectRequestInfo = function (tableName, requestInfo) {
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        selectPart = "SELECT COUNT(*) AS count FROM " + tableName;
        if (requestInfo.sqlwhere)
            wherePart = " where " + requestInfo.sqlwhere;
        if (requestInfo.sqlorder)
            orderPart = " order by " + requestInfo.sqlorder;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    AbstractSQL.GetSelectFromRequestInfo = function (tableName, requestInfo) {
        var selectPart = "";
        var wherePart = "";
        var orderPart = "";
        if (requestInfo.sqlselect.trim() == "")
            requestInfo.sqlselect = "*";
        selectPart = "Select " + requestInfo.sqlselect + " from " + tableName;
        if (requestInfo.sqlwhere)
            wherePart = " where " + requestInfo.sqlwhere;
        if (requestInfo.sqlorder)
            orderPart = " order by " + requestInfo.sqlorder;
        return (selectPart + wherePart + orderPart).trim() + ";";
    };
    AbstractSQL.GetUpdateFromBodyStatement = function (tableName, identityColumn, tableColumnProperties, updateInfo) {
        var sql = "Update " + tableName + " Set ";
        var setArray = [];
        for (var i = 0; i < tableColumnProperties.length; i++) {
            var prop = tableColumnProperties[i];
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push("'" + prop.column_name + "'=");
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
            (" Where " + identityColumn + "=" + updateInfo[identityColumn]));
    };
    AbstractSQL.GetUpdateStatement = function (tableName, identityColumn, tableColumnProperties, request) {
        var sql = "Update " + tableName + " Set ";
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
    AbstractSQL.GetInsertStatement = function (tableName, columnProperties, requestInfo) {
        var sql = "Insert into " + tableName + " ";
        var asqlColumns = [];
        var asqlValues = [];
        var insertInfo = {};
        if (requestInfo instanceof factory_1.RequestInfo)
            insertInfo = requestInfo.updateBody;
        else
            insertInfo = requestInfo;
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
            "('" +
            asqlColumns.join("','") +
            "') Values (" +
            asqlValues.join(", ") +
            ")");
    };
    AbstractSQL.GetSelectWithIdStatement = function (tableName, identityColumn, id) {
        return "select * from " + tableName + " where " + identityColumn + " = " + id + ";";
    };
    return AbstractSQL;
}());
exports.AbstractSQL = AbstractSQL;
//# sourceMappingURL=AbstractSQL.js.map