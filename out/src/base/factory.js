"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var AObject = /** @class */ (function () {
    function AObject(oArray, aProp) {
        var _this = this;
        if (oArray) {
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
    }
    return AObject;
}());
exports.AObject = AObject;
var JsonDatabase = /** @class */ (function () {
    function JsonDatabase(baseArray, aProp) {
        var _this = this;
        this.baseArray = baseArray;
        this.GetPropArray = function (oArray, propertyName) {
            var ret = [];
            oArray.forEach(function (row) {
                if (ret.indexOf(row[propertyName]) == -1) {
                    ret.push(row[propertyName]);
                }
            });
            return ret;
        };
        this.FindFirstObjWithFilter = function (firstSel, firstSelVal, secondSel, secondSelVal) {
            var objs = _this.db[firstSel][secondSel];
            objs.forEach(function (column) {
                if (column[secondSel] == secondSelVal)
                    return column;
            });
        };
        this.db = new AObject(baseArray, aProp);
    }
    JsonDatabase.prototype.Find = function (filter) {
        var ret = [];
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
                ret.push(column);
        });
        return ret;
    };
    return JsonDatabase;
}());
exports.JsonDatabase = JsonDatabase;
var DaoResult = /** @class */ (function () {
    function DaoResult(rows, updated, deleted, count, created, lastId, error) {
        this.rows = rows;
        this.updated = updated;
        this.deleted = deleted;
        this.count = count;
        this.created = created;
        this.lastId = lastId;
        this.error = error;
        this.exists = 0;
        if (!rows)
            this.rows = [];
        if (!updated)
            this.updated = 0;
        if (!deleted)
            this.deleted = 0;
        if (!count)
            this.count = 0;
        this.exists = this.count;
        if (!created)
            this.created = 0;
        if (!lastId)
            this.lastId = 0;
        if (!error)
            this.error = {};
    }
    return DaoResult;
}());
exports.DaoResult = DaoResult;
var ApiJsonResponse = /** @class */ (function () {
    function ApiJsonResponse() {
    }
    ApiJsonResponse.prototype.awaitAndRespond = function (request, response, promise, apiAction) {
        return __awaiter(this, void 0, void 0, function () {
            var id, answer, result, errResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (request.params) {
                            if (request.params.id) {
                                id = request.params.id;
                            }
                        }
                        return [4 /*yield*/, promise];
                    case 1:
                        answer = _a.sent();
                        switch (apiAction) {
                            case enums_1.enumApiActions.Error:
                                response.status(answer.status);
                                break;
                            case enums_1.enumApiActions.Read:
                                response.status(200);
                                break;
                            case enums_1.enumApiActions.Update:
                            case enums_1.enumApiActions.Create:
                            case enums_1.enumApiActions.Delete:
                                response.status(201);
                                break;
                        }
                        result = new DaoResult();
                        if (id)
                            result.lastId = id;
                        switch (apiAction) {
                            case enums_1.enumApiActions.Error:
                                errResponse = {};
                                errResponse["message"] = answer["message"];
                                errResponse["expose"] = answer["expose"];
                                errResponse["statusCode"] = answer["statusCode"];
                                errResponse["status"] = answer["status"];
                                errResponse["body"] = answer["body"];
                                errResponse["type"] = answer["type"];
                                errResponse["stack"] = answer["stack"];
                                result.error = errResponse;
                                break;
                            case enums_1.enumApiActions.Read:
                                result.rows = answer;
                                if (result.rows.length)
                                    result.count = result.rows.length;
                                break;
                            case enums_1.enumApiActions.Count:
                                result.count = answer[0].count;
                                break;
                            case enums_1.enumApiActions.Create:
                                result.lastId = answer;
                                if (result.lastId)
                                    result.created = 1;
                                result.count = 1;
                                break;
                            case enums_1.enumApiActions.Update:
                                result.updated = answer[0];
                                result.count = answer[0];
                                break;
                            case enums_1.enumApiActions.Delete:
                                result.deleted = answer[0];
                                break;
                        }
                        result.exists = result.count >= 1 ? 1 : 0;
                        response.json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ApiJsonResponse;
}());
exports.ApiJsonResponse = ApiJsonResponse;
var RunningStatus = /** @class */ (function () {
    function RunningStatus(status, apiServer, dbConnect) {
        this.status = status;
        this.apiServer = apiServer;
        this.dbConnect = dbConnect;
    }
    Object.defineProperty(RunningStatus.prototype, "Status", {
        get: function () {
            return this.status;
        },
        set: function (value) {
            this.status = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RunningStatus.prototype, "ApiServer", {
        get: function () {
            return this.apiServer;
        },
        set: function (value) {
            this.apiServer = value;
            if (this.apiServer == enums_1.enumRunningStatus.ApiServerInitializing) {
                this.status = enums_1.enumRunningStatus.Initializing;
            }
            if (this.apiServer == enums_1.enumRunningStatus.ApiServerUp &&
                this.dbConnect == enums_1.enumRunningStatus.DbConnectConnected) {
                this.status = enums_1.enumRunningStatus.UpAndConnected;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RunningStatus.prototype, "DbConnect", {
        get: function () {
            return this.dbConnect;
        },
        set: function (value) {
            this.dbConnect = value;
            if (this.dbConnect == enums_1.enumRunningStatus.DbConnectInitializing) {
                this.status = enums_1.enumRunningStatus.Initializing;
            }
            if (this.apiServer == enums_1.enumRunningStatus.ApiServerUp &&
                this.dbConnect == enums_1.enumRunningStatus.DbConnectConnected) {
                this.status = enums_1.enumRunningStatus.UpAndConnected;
            }
        },
        enumerable: true,
        configurable: true
    });
    return RunningStatus;
}());
exports.RunningStatus = RunningStatus;
var Configuration = /** @class */ (function () {
    function Configuration(databaseType, connectionString, listenPort, database, user, password, host, server, port) {
        this.databaseType = databaseType;
        this.connectionString = connectionString;
        this.listenPort = listenPort;
        this.database = database;
        this.user = user;
        this.password = password;
        this.host = host;
        this.server = server;
        this.port = port;
        if (connectionString === null)
            connectionString = "Data Source=sqlite.db;Version=3;New=True;";
        if (database === null)
            database = "Default";
        if (listenPort === null)
            listenPort = 8000;
        if (databaseType === null)
            databaseType = enums_1.enumDatabaseType.SQLite;
    }
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=factory.js.map