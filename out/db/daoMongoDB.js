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
var factory_1 = require("./../base/factory");
var mongodb_1 = require("mongodb");
var abstracts_1 = require("../base/abstracts");
var enums_1 = require("../base/enums");
var DaoMongoDB = /** @class */ (function (_super) {
    __extends(DaoMongoDB, _super);
    function DaoMongoDB(server, config, status, callback) {
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
        status.DbConnect = enums_1.enumRunningStatus.DbConnectInitializing;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = _this;
        mongodb_1.MongoClient.connect(self.config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
            if (error) {
                self.status.DbConnect = enums_1.enumRunningStatus.DbConnectError;
                console.log(error);
            }
            self.db = client.db(self.config.database);
            self.status.DbConnect = enums_1.enumRunningStatus.DbConnectConnected;
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
    DaoMongoDB.prototype.AsyncGet = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
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
                if (result) {
                    answer.rows = result;
                    answer.count = result.length;
                }
                resolve(answer);
            });
        });
    };
    DaoMongoDB.prototype.AsyncGetId = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            collection.findOne({ _id: new mongodb_1.ObjectID(request.params.id) }, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result != null) {
                    answer.rows = result;
                }
                else {
                    answer.unUsedIds.push(request.params.id);
                }
                resolve(answer);
            });
        });
    };
    DaoMongoDB.prototype.AsyncExistId = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        return new Promise(function (resolve, reject) {
            collection.findOne({ _id: new mongodb_1.ObjectID(request.params.id) }, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result)
                    answer.count = 1;
                resolve(answer);
            });
        });
    };
    DaoMongoDB.prototype.AsyncPatchId = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        var body;
        if (request.body.insert != null)
            body = request.body.insert;
        if (request.body.update != null)
            body = request.body.update;
        var id = request.params.id;
        return this.AsyncUpsertOne(answer, collectionName, body, id);
    };
    DaoMongoDB.prototype.AsyncPatch = function (collectionName, request) {
        return this.AsyncPut(collectionName, request, true);
    };
    DaoMongoDB.prototype.AsyncPut = function (collectionName, request, updateOnly) {
        var _this = this;
        if (updateOnly === void 0) { updateOnly = false; }
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        var postBody;
        if (request.body.insert != null)
            postBody = request.body.insert;
        if (request.body.update != null)
            postBody = request.body.update;
        var promises = [];
        if (postBody instanceof Array) {
            postBody.forEach(function (postItem) {
                if (postItem.hasOwnProperty("_id")) {
                    var body = {};
                    var id;
                    Object.keys(postItem).forEach(function (key) {
                        if (key == "_id")
                            id = postItem["_id"];
                        else
                            body[key] = postItem[key];
                    });
                    promises.push(_this.AsyncUpsertOne(answer, collectionName, body, id));
                }
                else {
                    if (!updateOnly)
                        promises.push(_this.AsyncUpsertOne(answer, collectionName, postItem));
                }
            });
            return Promise.all(promises);
        }
        else {
            var body = {};
            var id = request.params.id;
            Object.keys(postBody).forEach(function (key) {
                if (key == "_id")
                    id = postBody["_id"];
                else
                    body[key] = postBody[key];
            });
            return this.AsyncUpsertOne(answer, collectionName, id, body);
        }
    };
    //Update or insert a document
    //no id means insert
    //id = "0" means do nothing
    DaoMongoDB.prototype.AsyncUpsertOne = function (answer, collectionName, body, id) {
        var collection = this.db.collection(collectionName);
        switch (id) {
            case null:
                return new Promise(function (resolve, reject) {
                    collection.insertOne(body, function (error, result) {
                        if (error)
                            reject(error);
                        if (result) {
                            answer.createdIds.push(result.insertedId);
                            answer.created++;
                        }
                        resolve(answer);
                    });
                });
                break;
            case "0":
                break;
            default:
                return new Promise(function (resolve, reject) {
                    collection.updateOne({ _id: new mongodb_1.ObjectID(id) }, { $set: body }, function (error, result) {
                        if (error)
                            reject(error);
                        if (result.matchedCount) {
                            answer.updatedIds.push(id);
                            answer.updated++;
                        }
                        else {
                            answer.unUsedBodies.push(body);
                            answer.unUsedIds.push(id);
                        }
                        resolve(answer);
                    });
                });
                break;
        }
    };
    DaoMongoDB.prototype.AsyncPost = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        var postBody;
        if (request.body.insert != null)
            postBody = request.body.insert;
        if (request.body.update != null)
            postBody = request.body.update;
        if (postBody instanceof Array)
            return new Promise(function (resolve, reject) {
                collection.insertMany(postBody, function (error, result) {
                    if (error)
                        reject(error);
                    Object.keys(result.insertedIds).forEach(function (key) {
                        answer.createdIds.push(result.insertedIds[key]);
                    });
                    resolve(answer);
                });
            });
        else
            return new Promise(function (resolve, reject) {
                collection.insertOne(postBody, function (error, result) {
                    if (error)
                        reject(error);
                    if (result)
                        answer.createdIds.push(result.insertedId);
                    resolve(answer);
                });
            });
    };
    DaoMongoDB.prototype.AsyncPutId = function (collectionName, request) { return this.AsyncPatchId(collectionName, request); };
    DaoMongoDB.prototype.AsyncCount = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        var query = {};
        if (request.body["query"] != null)
            query = request.body["query"];
        return new Promise(function (resolve, reject) {
            collection.find(query).count(function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                if (result)
                    answer.count = result;
                resolve(answer);
            });
        });
    };
    DaoMongoDB.prototype.AsyncDeleteId = function (collectionName, request) {
        var collection = this.db.collection(collectionName);
        var answer = new factory_1.DaoResult(request);
        var filter = { _id: new mongodb_1.ObjectID(request.params.id) };
        return new Promise(function (resolve, reject) {
            collection.deleteOne(filter, function (error, result) {
                if (error)
                    reject(error);
                answer.deletedIds.push(request.params.id);
                answer.count = result.deletedCount;
                resolve(answer);
            });
        });
    };
    return DaoMongoDB;
}(abstracts_1.AbstractDaoSupport));
exports.DaoMongoDB = DaoMongoDB;
//# sourceMappingURL=daoMongoDB.js.map