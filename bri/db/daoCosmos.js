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
var CosmosClient = require('@azure/cosmos').CosmosClient;
var AbstractDao_1 = require("./AbstractDao");
var custom_1 = require("./../base/custom");
var enums_1 = require("../base/enums");
var DaoCosmos = /** @class */ (function (_super) {
    __extends(DaoCosmos, _super);
    function DaoCosmos(server, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.callback = callback;
        _this.primaryKeyColumnName = function (requestInfo) { return "id"; };
        _this.cosmosCollectionNames = [];
        _this.cosmosViewNames = [];
        _this.tableExists = function (requestInfo) {
            var ret = false;
            _this.cosmosCollectionNames.forEach(function (col) {
                if (col == requestInfo.originalUnitId)
                    ret = true;
            });
            return ret;
        };
        _this.GetTableNames = function () { return _this.cosmosCollectionNames; };
        _this.GetViewNames = function () { return _this.cosmosViewNames; };
        _this.GetPrimaryKeys = function () {
            var ret = {};
            var tableNames = _this.GetTableNames();
            tableNames.forEach(function (table) {
                ret[table] = "id";
            });
            return ret;
        };
        _this.config = server.config;
        _this.status = server.status;
        return _this;
    }
    DaoCosmos.prototype.createForeignKey = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    DaoCosmos.prototype.createTable = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.containers.createIfNotExists({ id: requestInfo.originalUnitId })
                            .then(function (result) {
                            _this.getDbInfo();
                            callback(null, 1);
                        })
                            .catch(function (error) {
                            callback(error);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.deleteTable = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        return [4 /*yield*/, collection.delete()
                                .then(function () {
                                _this.getDbInfo();
                                callback(null, 1);
                            })
                                .catch(function (error) {
                                callback(error);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.createColumn = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    DaoCosmos.prototype.executeSql = function (sql, callback) {
        throw new Error("Method not implemented.");
    };
    DaoCosmos.prototype.itemExists = function (requestInfo, itemId, callback) {
        this.getItem(requestInfo, itemId, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(null, result.length);
        });
    };
    DaoCosmos.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, endpoint, key;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        this.status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
                        endpoint = this.config.host;
                        key = this.config.authKey;
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                        this.client = new CosmosClient({ endpoint: endpoint, key: key });
                        return [4 /*yield*/, this.client.databases.createIfNotExists({ id: this.config.databaseId })
                                .then(function (db) {
                                self.db = db.database;
                                _this.getDbInfo(function (error, result) {
                                    if (error)
                                        self.server.addError(error);
                                    if (result) {
                                        if (result == "1") {
                                            self.callback(null, self.server.routing);
                                            console.log("Connected to CosmosDb: `" + self.config.databaseId + "` on process:" + process.pid + ".");
                                            self.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                                        }
                                    }
                                });
                            })
                                .catch(function (error) {
                                console.log(error);
                                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.getDbInfo = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, containersList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cosmosCollectionNames = [];
                        iterator = this.db.containers.readAll();
                        return [4 /*yield*/, iterator.fetchAll(function (result) { console.log(result); console.log("GetDbInfo Cosmos"); })];
                    case 1:
                        containersList = (_a.sent()).resources;
                        containersList.forEach(function (item) {
                            _this.cosmosCollectionNames.push(item.id);
                        });
                        if (callback)
                            callback(null, "1");
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.getAllItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, resources, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.items.readAll().fetchAll()];
                    case 2:
                        resources = (_a.sent()).resources;
                        callback(null, resources);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        callback(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.countItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.container(requestInfo.originalUnitId);
                this.getAllItems(requestInfo, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, (result.lenght));
                    callback(null, 0);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoCosmos.prototype.getItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, querySpec, resources, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        querySpec = {
                            query: 'SELECT * FROM root r WHERE r.id = @id',
                            parameters: [{
                                    name: '@id',
                                    value: itemId
                                }]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.items.query(querySpec, { enableCrossPartitionQuery: true }).fetchAll()];
                    case 2:
                        resources = (_a.sent()).resources;
                        callback(null, resources);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        callback(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.addItem = function (requestInfo, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, itemResponse, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        body.date = Date.now();
                        body.completed = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.items.create(body)];
                    case 2:
                        itemResponse = _a.sent();
                        callback(null, itemResponse.item.id);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        callback(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.updateItem = function (requestInfo, id, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, newBody, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        newBody = {};
                        custom_1.CloneObjectInfo(body, newBody);
                        if (id)
                            newBody["id"] = id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.items.upsert(newBody)];
                    case 2:
                        result = _a.sent();
                        callback(null, result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        callback(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.updateAll = function (requestInfo, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var container, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = this.db.container(requestInfo.originalUnitId);
                        return [4 /*yield*/, container.items
                                .query(requestInfo.mongoQuery)
                                .fetchAll()];
                    case 1:
                        items = (_a.sent()).resources;
                        items.forEach(function (item) {
                            custom_1.CloneObjectInfo(body, item);
                            container.items.upsert(item);
                        }).then(function (result) { callback(null, result); })
                            .catch(function (error) {
                            callback(error);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoCosmos.prototype.deleteItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, itemResponse, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.container(requestInfo.originalUnitId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.item(itemId).delete()];
                    case 2:
                        itemResponse = _a.sent();
                        callback(null, itemResponse);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        callback(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DaoCosmos;
}(AbstractDao_1.AbstractDao));
exports.DaoCosmos = DaoCosmos;
//# sourceMappingURL=daoCosmos.js.map