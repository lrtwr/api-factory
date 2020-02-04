"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jl;
(function (jl) {
    var jsonDatabase = /** @class */ (function () {
        function jsonDatabase(baseArray, aProp) {
            var _this = this;
            this.baseArray = baseArray;
            this.GetPropArray = function (oArray, propertyName) {
                var ret_value = [];
                oArray.forEach(function (row) {
                    if (ret_value.indexOf(row[propertyName]) == -1) {
                        ret_value.push(row[propertyName]);
                    }
                });
                return ret_value;
            };
            this.FindFirstObjWithFilter = function (firstSel, firstSelVal, secondSel, secondSelVal) {
                var objs = _this.db[firstSel][secondSel];
                objs.forEach(function (column) {
                    if (column[secondSel] == secondSelVal)
                        return column;
                });
            };
            this.db = new aObject(baseArray, aProp);
        }
        jsonDatabase.prototype.Find = function (filter) {
            var ret_value = [];
            this.baseArray.forEach(function (column) {
                var doReturn = 1;
                Object.keys(filter).forEach(function (prop) {
                    if (doReturn) {
                        if (column[prop] != filter[prop]) {
                            doReturn = 0;
                        }
                    }
                });
                if (doReturn)
                    ret_value.push(column);
            });
            return ret_value;
        };
        return jsonDatabase;
    }());
    jl.jsonDatabase = jsonDatabase;
    var aObject = /** @class */ (function () {
        function aObject(oArray, aProp) {
            var _this = this;
            if (oArray.length > 0) {
                if (!aProp)
                    aProp = Object.keys(oArray[0]);
                aProp.forEach(function (prop) {
                    if (!_this[prop])
                        _this[prop] = {};
                    oArray.forEach(function (obj) {
                        if (!_this[prop][obj[prop]])
                            _this[prop][obj[prop]] = [];
                        _this[prop][obj[prop]].push(obj);
                    });
                });
            }
        }
        return aObject;
    }());
    jl.aObject = aObject;
})(jl = exports.jl || (exports.jl = {}));
//# sourceMappingURL=jl.js.map