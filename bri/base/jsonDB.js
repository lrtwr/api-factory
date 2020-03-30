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
var DynamicClass = /** @class */ (function () {
    function DynamicClass() {
    }
    return DynamicClass;
}());
exports.DynamicClass = DynamicClass;
var JsonDatabase = /** @class */ (function (_super) {
    __extends(JsonDatabase, _super);
    function JsonDatabase(oArray, aProp) {
        if (oArray === void 0) { oArray = []; }
        if (aProp === void 0) { aProp = []; }
        var _this = _super.call(this) || this;
        _this["get"] = function (searchArray) {
            var obj = _this;
            for (var _i = 0, searchArray_1 = searchArray; _i < searchArray_1.length; _i++) {
                var key = searchArray_1[_i];
                if (obj[key]) {
                    obj = obj[key];
                }
                else {
                    obj = null;
                    break;
                }
            }
            return obj;
        };
        _this["exist"] = function (searchArray) {
            return _this["get"](searchArray) != null ? true : false;
        };
        if (oArray.length > 0 && aProp.length == 0)
            aProp = Object.keys(oArray[0]);
        if (oArray.length > 0 && aProp.length > 0) {
            if (!aProp)
                aProp = Object.keys(oArray[0]);
            _this["_keys"] = [];
            aProp.forEach(function (prop) {
                _this["_keys"].push(prop);
                if (!_this[prop])
                    _this[prop] = new DynamicClass();
                oArray.forEach(function (obj) {
                    if (!_this[prop]["_keys"])
                        _this[prop]["_keys"] = [];
                    if (_this[prop]["_keys"].indexOf(obj[prop]) == -1)
                        _this[prop]["_keys"].push(obj[prop]);
                    if (!_this[prop][obj[prop]])
                        _this[prop][obj[prop]] = new DynamicClass();
                    if (!_this[prop][obj[prop]]["_array"])
                        _this[prop][obj[prop]]["_array"] = [];
                    _this[prop][obj[prop]]["_array"].push(obj);
                    _this[prop][obj[prop]]["_keys"] = [];
                    aProp.forEach(function (prop2) {
                        _this[prop][obj[prop]]["_keys"].push(prop2);
                        if (prop2 != prop) {
                            if (!_this[prop][obj[prop]][prop2])
                                _this[prop][obj[prop]][prop2] = new DynamicClass();
                            oArray.forEach(function (obj2) {
                                if (obj2 == obj) {
                                    if (!_this[prop][obj[prop]][prop2]["_keys"])
                                        _this[prop][obj[prop]][prop2]["_keys"] = [];
                                    if (_this[prop][obj[prop]][prop2]["_keys"].indexOf(obj2[prop2]) == -1)
                                        _this[prop][obj[prop]][prop2]["_keys"].push(obj2[prop2]);
                                    if (!_this[prop][obj[prop]][prop2][obj2[prop2]])
                                        _this[prop][obj[prop]][prop2][obj2[prop2]] = new DynamicClass();
                                    if (!_this[prop][obj[prop]][prop2][obj2[prop2]]["_array"])
                                        _this[prop][obj[prop]][prop2][obj2[prop2]]["_array"] = [];
                                    _this[prop][obj[prop]][prop2][obj2[prop2]]["_array"].push(obj2);
                                }
                            });
                        }
                    });
                });
            });
        }
        return _this;
    }
    return JsonDatabase;
}(DynamicClass));
exports.JsonDatabase = JsonDatabase;
var ColumnPropertyJDB = /** @class */ (function (_super) {
    __extends(ColumnPropertyJDB, _super);
    function ColumnPropertyJDB(baseArray) {
        return _super.call(this, baseArray, []) || this;
    }
    ColumnPropertyJDB.prototype.tableNames = function () {
        var _a;
        return _a = this.get(["table_type", "table", "table_name", "_keys"]), (_a !== null && _a !== void 0 ? _a : []);
    };
    ;
    ColumnPropertyJDB.prototype.viewNames = function () {
        var _a;
        return _a = this.get(["table_type", "view", "table_name", "_keys"]), (_a !== null && _a !== void 0 ? _a : []);
    };
    ;
    ColumnPropertyJDB.prototype.tableExists = function (tableName) {
        return this.exist(["table_name", tableName]);
    };
    ColumnPropertyJDB.prototype.columnProperties = function (tableName) {
        var _a;
        return _a = this.get(["table_name", tableName, "_array"]), (_a !== null && _a !== void 0 ? _a : []);
    };
    ColumnPropertyJDB.prototype.primaryKeyColumnName = function (tableName) {
        return this.get(["table_name", tableName, "column_is_pk", "1", "_array", "0", "column_name"]);
    };
    ColumnPropertyJDB.prototype.primaryKeys = function (tableName) {
        var _this = this;
        var ret = {};
        this.tableNames().forEach(function (table) {
            if (!tableName || table == tableName) {
                _this.table_name[table].column_is_pk["1"]._array.forEach(function (column) { return ret[table] = column.column_name; });
            }
        });
        return ret;
    };
    ColumnPropertyJDB.prototype.models = function (tableName) {
        var _this = this;
        var ret = {};
        this.tableNames().forEach(function (table) {
            if (!tableName || tableName == table) {
                ret[table] = {};
                _this.table_name[table]._array.forEach(function (column) {
                    ret[table][column.column_name] = column.data_type;
                });
            }
        });
        return ret;
    };
    return ColumnPropertyJDB;
}(JsonDatabase));
exports.ColumnPropertyJDB = ColumnPropertyJDB;
//# sourceMappingURL=jsonDB.js.map