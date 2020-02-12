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
var factory_1 = require("../base/factory");
var mongodb_1 = require("mongodb");
var daoMongoDB = /** @class */ (function (_super) {
    __extends(daoMongoDB, _super);
    function daoMongoDB(server, config, status, callback) {
        var _this = _super.call(this) || this;
        _this.server = server;
        _this.config = config;
        _this.status = status;
        _this.callback = callback;
        _this.mongoCollectionNames = [];
        _this.mongoViewNames = [];
        _this.GetTableNames = function () {
            return _this.mongoCollectionNames;
        };
        _this.GetViewNames = function () {
            return _this.mongoViewNames;
        };
        status.DbConnect = factory_1.factory.enums.enumRunningStatus.DbConnectInitializing;
        var self = _this;
        mongodb_1.MongoClient.connect(self.config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
            if (error) {
                self.status.DbConnect = factory_1.factory.enums.enumRunningStatus.DbConnectError;
                console.log(error);
            }
            self.db = client.db(self.config.database);
            self.status.DbConnect = factory_1.factory.enums.enumRunningStatus.DbConnectConnected;
            console.log("Connected to MongoDb: `" + self.config.database + "`!");
            self.db.listCollections().toArray(function (error, colInfo) {
                if (error)
                    self.server.lastErrors.push(error);
                colInfo.forEach(function (column) {
                    if (column.type == "collection") {
                        self.mongoCollectionNames.push(column.name);
                    }
                    if (column.type == "view") {
                        self.mongoViewNames.push(column.name);
                    }
                });
                self.callback(self.server.routing);
            });
        });
        return _this;
    }
    daoMongoDB.prototype.AsyncGet = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
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
        var collection = this.db.collection(collectionName);
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
        var collection = this.db.collection(collectionName);
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
        var collection = this.db.collection(collectionName);
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
        var collection = this.db.collection(collectionName);
        return new Promise(function (resolve, reject) {
            collection.updateOne({ _id: new mongodb_1.ObjectID(request.params.id) }, { $set: request.body }, function (error, result) {
                if (error)
                    reject(error);
                resolve([result.modifiedCount]);
            });
        });
    };
    daoMongoDB.prototype.AsyncCount = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
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
        var collection = this.db.collection(collectionName);
        var filter = { _id: new mongodb_1.ObjectID(request.params.id) };
        return new Promise(function (resolve, reject) {
            collection.deleteOne(filter, function (error, result) {
                if (error)
                    reject(error);
                resolve([result.deletedCount]);
            });
        });
    };
    return daoMongoDB;
}(factory_1.factory.abstracts.AbstractDaoSupport));
exports.daoMongoDB = daoMongoDB;
//# sourceMappingURL=daoMongoDB.js.map