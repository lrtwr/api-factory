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
var jl_1 = require("./jl");
var factory;
(function (factory) {
    factory.jl = jl_1.jl;
    // export const GetPropArray = (
    //   oArray: factory.jl.DynamicObject,
    //   propertyName: string
    // ): string[] => {
    //   var ret_value: string[] = [];
    //   oArray.forEach(row => {
    //     if (ret_value.indexOf(row[propertyName]) == -1) {
    //       ret_value.push(row[propertyName]);
    //     }
    //   });
    //   return ret_value;
    // };
    var enumApiActions;
    (function (enumApiActions) {
        enumApiActions[enumApiActions["Create"] = 0] = "Create";
        enumApiActions[enumApiActions["Read"] = 1] = "Read";
        enumApiActions[enumApiActions["Update"] = 2] = "Update";
        enumApiActions[enumApiActions["Delete"] = 3] = "Delete";
        enumApiActions[enumApiActions["Count"] = 4] = "Count";
        enumApiActions[enumApiActions["Error"] = 5] = "Error";
    })(enumApiActions = factory.enumApiActions || (factory.enumApiActions = {}));
    var enumDatabaseType;
    (function (enumDatabaseType) {
        enumDatabaseType["MongoDb"] = "Mongo database";
        enumDatabaseType["SQLite"] = "SQLite 3";
        enumDatabaseType["SQLiteMemory"] = "SQLite 3 in Memory";
        enumDatabaseType["MySQL"] = "MySQL server";
        enumDatabaseType["MSSQL"] = "Microsoft SQL server";
    })(enumDatabaseType = factory.enumDatabaseType || (factory.enumDatabaseType = {}));
    var ApiTools = /** @class */ (function () {
        function ApiTools() {
        }
        ApiTools.prototype.awaitAndRespond = function (request, response, promise, apiAction) {
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
                                case enumApiActions.Error:
                                    response.status(answer.status);
                                    break;
                                case enumApiActions.Read:
                                    response.status(200);
                                    break;
                                case enumApiActions.Update:
                                case enumApiActions.Create:
                                case enumApiActions.Delete:
                                    response.status(201);
                                    break;
                            }
                            result = new daoResult();
                            if (id)
                                result.lastId = id;
                            switch (apiAction) {
                                case enumApiActions.Error:
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
                                case enumApiActions.Read:
                                    result.rows = answer;
                                    if (result.rows.length)
                                        result.count = result.rows.length;
                                    break;
                                case enumApiActions.Count:
                                    result.count = answer[0].count;
                                    break;
                                case enumApiActions.Create:
                                    result.lastId = answer;
                                    if (result.lastId)
                                        result.created = 1;
                                    result.count = 1;
                                    break;
                                case enumApiActions.Update:
                                    result.updated = answer[0];
                                    result.count = answer[0];
                                    break;
                                case enumApiActions.Delete:
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
        return ApiTools;
    }());
    factory.ApiTools = ApiTools;
    var AbstractApiHandler = /** @class */ (function (_super) {
        __extends(AbstractApiHandler, _super);
        function AbstractApiHandler() {
            return _super.call(this) || this;
        }
        return AbstractApiHandler;
    }(ApiTools));
    factory.AbstractApiHandler = AbstractApiHandler;
    var AbstractDaoSupport = /** @class */ (function () {
        function AbstractDaoSupport(status) {
            var _this = this;
            this.GetTableNames = function () {
                return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.table, "table_name");
            };
            this.GetViewNames = function () {
                return _this.tableProperties.GetPropArray(_this.tableProperties.db.table_type.view, "table_name");
            };
            status.DbConnect = enumRunningStatus.DbConnectInitializing;
        }
        AbstractDaoSupport.prototype.GetColumnProperties = function (tableName) {
            return this.tableProperties.db.table_name[tableName];
        };
        AbstractDaoSupport.prototype.GetPrimarayKeyColumnName = function (tableName) {
            var ret_value;
            this.tableProperties.db.table_name[tableName].forEach(function (column) {
                if (column.column_is_pk) {
                    ret_value = column.column_name;
                }
            });
            return ret_value;
        };
        return AbstractDaoSupport;
    }());
    factory.AbstractDaoSupport = AbstractDaoSupport;
    var enumRunningStatus;
    (function (enumRunningStatus) {
        enumRunningStatus["Down"] = "Down";
        enumRunningStatus["Initializing"] = "Initializing";
        enumRunningStatus["ApiServerInitializing"] = "ApiServer is initializing";
        enumRunningStatus["DbConnectInitializing"] = "Database connection is initializing";
        enumRunningStatus["DbConnectConnected"] = "Database is Connected";
        enumRunningStatus["ApiServerUp"] = "ApiServer is Up";
        enumRunningStatus["ApiServerError"] = "ApiServer Error";
        enumRunningStatus["DbConnectError"] = "Database connection Error";
        enumRunningStatus["UpAndConnected"] = "Up and Running";
    })(enumRunningStatus = factory.enumRunningStatus || (factory.enumRunningStatus = {}));
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
                if (this.apiServer == enumRunningStatus.ApiServerInitializing) {
                    this.status = enumRunningStatus.Initializing;
                }
                if (this.apiServer == enumRunningStatus.ApiServerUp &&
                    this.dbConnect == enumRunningStatus.DbConnectConnected) {
                    this.status = enumRunningStatus.UpAndConnected;
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
                if (this.dbConnect == enumRunningStatus.DbConnectInitializing) {
                    this.status = enumRunningStatus.Initializing;
                }
                if (this.apiServer == enumRunningStatus.ApiServerUp &&
                    this.dbConnect == enumRunningStatus.DbConnectConnected) {
                    this.status = enumRunningStatus.UpAndConnected;
                }
            },
            enumerable: true,
            configurable: true
        });
        return RunningStatus;
    }());
    factory.RunningStatus = RunningStatus;
    var daoResult = /** @class */ (function () {
        function daoResult(rows, updated, deleted, count, created, lastId, error) {
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
        return daoResult;
    }());
    factory.daoResult = daoResult;
    var Configuration = /** @class */ (function () {
        function Configuration(databaseType, connectionString, listenPort, database, user, password, host, server) {
            this.databaseType = databaseType;
            this.connectionString = connectionString;
            this.listenPort = listenPort;
            this.database = database;
            this.user = user;
            this.password = password;
            this.host = host;
            this.server = server;
            if (connectionString === null)
                connectionString = "Data Source=sqlite.db;Version=3;New=True;";
            if (database === null)
                database = "Default";
            if (listenPort === null)
                listenPort = 8000;
            if (databaseType === null)
                databaseType = enumDatabaseType.SQLite;
        }
        return Configuration;
    }());
    factory.Configuration = Configuration;
})(factory = exports.factory || (exports.factory = {}));
//# sourceMappingURL=factory.js.map