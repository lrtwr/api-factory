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
exports.CloneObjectInfo = function (fromObj, toObj) {
    Object.keys(fromObj).forEach(function (key) {
        toObj[key] = fromObj[key];
    });
};
function asyncUsing(resource, func) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 4]);
                    return [4 /*yield*/, func(resource)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, resource.dispose()];
                case 3:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.asyncUsing = asyncUsing;
function using(resource, func) {
    try {
        func(resource);
    }
    finally {
        resource.dispose();
    }
}
exports.using = using;
///eind
var JsonResult = /** @class */ (function () {
    function JsonResult(requestInfo, message) {
        if (message === void 0) { message = ""; }
        this.message = message;
        this.rows = [];
        this.count = 0;
        this.created = 0;
        this.updated = 0;
        this.deleted = 0;
        this.updatedIds = [];
        this.createdIds = [];
        this.deletedIds = [];
        this.unUsedBodies = [];
        this.unUsedIds = [];
        this.method = "";
        this.method = requestInfo.method;
        this.processId = process.pid;
    }
    Object.defineProperty(JsonResult.prototype, "exists", {
        // jeroen exist nog toevoegen aan result.json object
        get: function () { return this.count > 0 ? 1 : 0; },
        enumerable: true,
        configurable: true
    });
    return JsonResult;
}());
exports.JsonResult = JsonResult;
var ApiJsonResponse = /** @class */ (function () {
    function ApiJsonResponse() {
    }
    ApiJsonResponse.prototype.awaitAndRespond = function (requestInfo, response, promise, apiAction) {
        return __awaiter(this, void 0, void 0, function () {
            var answer, error_1, newanswer, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promise];
                    case 1:
                        answer = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        newanswer = new JsonResult(requestInfo);
                        //cloneObjectInfo(answer,newanswer);
                        newanswer.error = error_1;
                        answer = newanswer;
                        return [3 /*break*/, 3];
                    case 3:
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
                            case enums_1.enumApiActions.System:
                                if (!answer.message)
                                    answer.message = "";
                                break;
                        }
                        if (answer instanceof Array) {
                            if (answer.length > 0)
                                if (answer[0] instanceof JsonResult)
                                    result = answer[0];
                        }
                        if (answer instanceof JsonResult)
                            result = answer;
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
    function Configuration(databaseType, authKey, //cosmos
    databaseId, //cosmos
    collectionId, //cosmos
    connectionString, //cosmos
    database, user, password, host, server, port, operationMode) {
        this.databaseType = databaseType;
        this.authKey = authKey;
        this.databaseId = databaseId;
        this.collectionId = collectionId;
        this.connectionString = connectionString;
        this.database = database;
        this.user = user;
        this.password = password;
        this.host = host;
        this.server = server;
        this.port = port;
        this.operationMode = operationMode;
        if (connectionString === null)
            connectionString = "Data Source=sqlite.db;Version=3;New=True;";
        if (database === null)
            database = "Default";
        if (databaseType === null)
            databaseType = enums_1.enumDatabaseType.SQLite;
    }
    Object.defineProperty(Configuration.prototype, "isSql", {
        get: function () {
            return this.databaseType == enums_1.enumDatabaseType.MSSQL || this.databaseType == enums_1.enumDatabaseType.MySQL || this.databaseType == enums_1.enumDatabaseType.SQLite || this.databaseType == enums_1.enumDatabaseType.SQLiteMemory;
        },
        enumerable: true,
        configurable: true
    });
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=custom.js.map