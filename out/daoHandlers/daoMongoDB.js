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
var factory_1 = require("../setup/factory");
var mongodb_1 = require("mongodb");
var daoMongoDB = /** @class */ (function (_super) {
    __extends(daoMongoDB, _super);
    function daoMongoDB(server, config, status, callback) {
        var _this = _super.call(this, status) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        _this.AsyncConnect();
        return _this;
    }
    daoMongoDB.prototype.dbConnect = function (deze) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mongodb_1.MongoClient.connect(deze.config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
                    if (error) {
                        deze.status.DbConnect = factory_1.factory.enumRunningStatus.DbConnectError;
                        console.log(error);
                    }
                    deze.database = client.db(deze.config.database);
                    deze.status.DbConnect = factory_1.factory.enumRunningStatus.DbConnectConnected;
                    deze.database = client.db(deze.config.database);
                    console.log("Connected to MongoDb: `" + deze.config.database + "`!");
                    deze.callback(deze.server);
                });
                return [2 /*return*/];
            });
        });
    };
    daoMongoDB.prototype.AsyncConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbConnect(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    daoMongoDB.prototype.AsyncGet = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        var projection = {};
        var sort = {};
        var query = {};
        var body = request.body;
        if (body["projection"] != null)
            projection = body["projection"];
        if (body["query"] != null)
            query = body["query"];
        if (body["sort"] != null)
            sort = body["sort"];
        return new Promise(function (resolve, reject) {
            collection
                .find(query, { projection: projection })
                .sort(sort)
                .toArray(function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result)
                    resolve(result);
            });
        });
    };
    daoMongoDB.prototype.AsyncGetId = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        return new Promise(function (resolve, reject) {
            collection.findOne({ _id: new mongodb_1.ObjectID(request.params.id) }, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result != null)
                    resolve(result);
                else
                    resolve([]);
            });
        });
    };
    daoMongoDB.prototype.AsyncExistId = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        return new Promise(function (resolve, reject) {
            collection.findOne({ _id: new mongodb_1.ObjectID(request.params.id) }, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result)
                    resolve([{ count: 1 }]);
                else
                    resolve([{ count: 0 }]);
            });
        });
    };
    daoMongoDB.prototype.AsyncPost = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        return new Promise(function (resolve, reject) {
            collection.insertOne(request.body, function (error, result) {
                if (error)
                    reject(error);
                console.log("1 document " + result.body + " created.");
                resolve(result.insertedId);
            });
        });
    };
    daoMongoDB.prototype.AsyncPatchId = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        return new Promise(function (resolve, reject) {
            collection.updateOne({ _id: new mongodb_1.ObjectID(request.params.id) }, { $set: request.body }, function (error, result) {
                if (error)
                    reject(error);
                resolve([result.modifiedCount]);
            });
        });
    };
    daoMongoDB.prototype.AsyncCount = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        var query = {};
        if (request.body["query"] != null)
            query = request.body["query"];
        return new Promise(function (resolve, reject) {
            collection.find(query).count(function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve([{ count: result }]);
            });
        });
    };
    daoMongoDB.prototype.AsyncDeleteId = function (collectionName, request) {
        var collection = this.database.collection(collectionName);
        var filter = { _id: new mongodb_1.ObjectID(request.params.id) };
        return new Promise(function (resolve, reject) {
            collection.deleteOne(filter, function (error, result) {
                if (error)
                    reject(error);
                resolve([result.deletedCount]);
            });
        });
    };
    daoMongoDB.prototype.GetCollectionOrTableNames = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var ret_val, tableNames;
            return __generator(this, function (_a) {
                ret_val = [];
                tableNames = [];
                this.database.listCollections().toArray(function (error, colInfo) {
                    colInfo.forEach(function (column) {
                        if (column.type == "collection") {
                            tableNames.push(column.name);
                        }
                    });
                    callback(tableNames);
                });
                return [2 /*return*/];
            });
        });
    };
    return daoMongoDB;
}(factory_1.factory.AbstractDaoSupport));
exports.daoMongoDB = daoMongoDB;
//# sourceMappingURL=daoMongoDB.js.map