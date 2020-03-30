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
var mongodb_1 = require("mongodb");
var AbstractDao_1 = require("./AbstractDao");
var enums_1 = require("../base/enums");
var mongodb_2 = require("mongodb");
var DaoMongo = /** @class */ (function (_super) {
    __extends(DaoMongo, _super);
    function DaoMongo(server, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.callback = callback;
        _this.primaryKeyColumnName = function (requestInfo) { return "_id"; };
        _this.tableExists = function (requestInfo) {
            var ret = false;
            _this.mongoCollectionNames.forEach(function (col) {
                if (col == requestInfo.originalUnitId)
                    ret = true;
            });
            return ret;
        };
        _this.mongoCollectionNames = [];
        _this.mongoViewNames = [];
        _this.getTableNames = function () {
            return _this.mongoCollectionNames;
        };
        _this.getViewNames = function () {
            return _this.mongoViewNames;
        };
        _this.getPrimaryKeys = function () {
            var ret = {};
            var tableNames = _this.getTableNames();
            tableNames.forEach(function (table) {
                ret[table] = "_id";
            });
            return ret;
        };
        _this.config = server.config;
        _this.status = server.status;
        return _this;
    }
    DaoMongo.prototype.createForeignKey = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    DaoMongo.prototype.createTable = function (requestInfo, callback) {
        var _this = this;
        var deze = this;
        this.db.createCollection(requestInfo.originalUnitId, function (error) {
            if (error)
                callback(error);
            else {
                deze.getDbInfo();
                var collection = _this.db.collection(requestInfo.originalUnitId);
                callback(null, collection != null);
            }
        });
    };
    DaoMongo.prototype.deleteTable = function (requestInfo, callback) {
        var deze = this;
        var collection = this.db.collection(requestInfo.originalUnitId);
        collection.drop(function (error, result) {
            if (error)
                callback(error);
            if (result) {
                deze.getDbInfo();
                callback(null, 1);
            }
            ;
        });
    };
    DaoMongo.prototype.createColumn = function (requestInfo, callback) {
        throw new Error("Method not implemented.");
    };
    DaoMongo.prototype.executeSql = function (sql, callback) {
        throw new Error("Method not implemented.");
    };
    DaoMongo.prototype.itemExists = function (unitId, itemId, callback) {
        var collection = this.db.collection(unitId);
        collection.findOne({ _id: new mongodb_2.ObjectID(itemId) }, function (error, result) {
            if (error)
                callback(error);
            if (result)
                callback(1);
            else
                callback(0);
        });
    };
    DaoMongo.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            var _this = this;
            return __generator(this, function (_a) {
                this.status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
                self = this;
                mongodb_1.MongoClient.connect(self.config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
                    if (error) {
                        self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                        _this.server.addError({ error: error, message: "Mongo connection error" });
                        console.log(error);
                    }
                    self.db = client.db(self.config.database);
                    _this.getDbInfo(function (error, result) {
                        if (error)
                            self.server.addError(error);
                        if (result) {
                            if (result == "1") {
                                self.callback(null, self.server.routing);
                                _this.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
                                console.log("Connected to MongoDb: `" + _this.config.database + "` on process:" + process.pid + ".");
                            }
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.getDbInfo = function (callback) {
        var _this = this;
        this.db.listCollections().toArray(function (error, result) {
            if (error) {
                if (callback)
                    callback(error);
            }
            else {
                _this.mongoCollectionNames = [];
                _this.mongoViewNames = [];
                result.forEach(function (column) {
                    if (column.type == "collection") {
                        _this.mongoCollectionNames.push(column.name);
                    }
                    if (column.type == "view") {
                        _this.mongoViewNames.push(column.name);
                    }
                });
                if (callback)
                    callback(null, 1);
            }
        });
    };
    DaoMongo.prototype.getAllItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                collection
                    .find(requestInfo.mongoQuery, { projection: requestInfo.mongoProjection })
                    .sort(requestInfo.mongoSort)
                    .toArray(function (error, result) {
                    if (error)
                        callback(error);
                    callback(null, result);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.getItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                collection.findOne({ _id: new mongodb_2.ObjectID(itemId) }, function (error, result) {
                    if (error)
                        callback(error);
                    callback(null, result);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.countItems = function (requestInfo, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                collection.find(requestInfo.mongoQuery).count(function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.addItem = function (requestInfo, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db.collection(requestInfo.originalUnitId);
                        return [4 /*yield*/, collection.insertOne(body, function (error, result) {
                                if (error)
                                    callback(error);
                                if (result)
                                    callback(null, result.insertedId);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DaoMongo.prototype.updateItem = function (requestInfo, id, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                collection.updateOne({ _id: new mongodb_2.ObjectID(id) }, { $set: body }, function (error, result) {
                    if (error)
                        callback(error);
                    callback(null, [result.modifiedCount]);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.updateAll = function (requestInfo, body, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                collection.updateMany(requestInfo.mongoQuery, { $set: body }, function (error, result) {
                    if (error)
                        callback(error);
                    callback(null, [result.modifiedCount]);
                });
                return [2 /*return*/];
            });
        });
    };
    DaoMongo.prototype.deleteItem = function (requestInfo, itemId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, filter;
            return __generator(this, function (_a) {
                collection = this.db.collection(requestInfo.originalUnitId);
                filter = { _id: new mongodb_2.ObjectID(itemId) };
                collection.deleteOne(filter, function (error, result) {
                    if (error)
                        callback(error);
                    if (result)
                        callback(null, result);
                });
                return [2 /*return*/];
            });
        });
    };
    return DaoMongo;
}(AbstractDao_1.AbstractDao));
exports.DaoMongo = DaoMongo;
//# sourceMappingURL=daoMongoDB.js.map