"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_1 = require("../base/custom");
var ApiDbHandler = /** @class */ (function () {
    function ApiDbHandler(dao, server) {
        var _this = this;
        this.dao = dao;
        this.server = server;
        this.asyncPut = function (requestInfo) {
            if (!requestInfo.updateBody)
                return Promise.resolve(new custom_1.JsonResult(requestInfo, "This put call has no body. Please add {'Content-Type': 'application/json'} to the header."));
            return _this.asyncPost(requestInfo);
        };
        this.config = server.config;
        this.status = server.status;
        this.dao.connect();
    }
    ApiDbHandler.prototype.asyncPost = function (requestInfo) {
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var identityColumn = this.dao.primaryKeyColumnName(requestInfo);
        var answer = new custom_1.JsonResult(requestInfo);
        var postBody = requestInfo.updateBody;
        var self = this;
        if (!postBody)
            return Promise.reject("No body found in the request.affix");
        var promises = [];
        if (postBody instanceof Array) {
            postBody.forEach(function (postItem) { return promises.push(self.asyncPostOne(requestInfo, postItem, identityColumn, answer)); });
            return Promise.all(promises);
        }
        else
            return this.asyncPostOne(requestInfo, postBody, identityColumn, answer);
    };
    ApiDbHandler.prototype.asyncPostOne = function (requestInfo, body, identityColumn, answer) {
        var self = this;
        if (!body.hasOwnProperty(identityColumn)) {
            return new Promise(function (resolve, reject) {
                self.dao.addItem(requestInfo, body, function (error, result) {
                    if (error)
                        reject(error);
                    if (result) {
                        answer.createdIds.push(result);
                        answer.created++;
                        answer.count++;
                        if (answer.count == 1)
                            answer.message = "One record is added or updated in table '" + requestInfo.tableName + "'.";
                        else
                            answer.message = answer.count + " records are added or updated in table '" + requestInfo.tableName + "'.";
                        resolve(answer);
                    }
                });
            });
        }
        else {
            answer.unUsedBodies.push(body);
            answer.message += "Identitycolumn " + identityColumn + " information given. Record not created. Remove identityColum in the post.";
            answer.unUsedIds.push(body[identityColumn]);
            return Promise.resolve(answer);
        }
    };
    ApiDbHandler.prototype.asyncPatchOne = function (requestInfo, id, body, identityColumn, answer) {
        var self = this;
        if (!body.hasOwnProperty(identityColumn)) {
            return new Promise(function (resolve, reject) {
                self.dao.updateItem(requestInfo, id, body, function (error, result) {
                    var _a;
                    if (error)
                        reject(error);
                    if (result) {
                        answer.updatedIds.push((_a = requestInfo.id, (_a !== null && _a !== void 0 ? _a : body[identityColumn])));
                        answer.updated++;
                        answer.count++;
                        if (answer.count == 1)
                            answer.message = "One record is added or updated in table '" + requestInfo.tableName + "'.";
                        else
                            answer.message = answer.count + " records are added or updated in table '" + requestInfo.tableName + "'.";
                        answer.message += "Table '" + requestInfo.tableName + "' is updated.";
                        resolve(answer);
                    }
                });
            });
        }
        else {
            answer.unUsedBodies.push(body);
            answer.message += "No information in identitycolumn " + identityColumn + ".";
            answer.unUsedIds.push(null);
            return Promise.resolve(answer);
        }
    };
    ApiDbHandler.prototype.asyncPatchAll = function (requestInfo, body, answer) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.dao.updateAll(requestInfo, body, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.updatedIds = result;
                    answer.updated = answer.updatedIds.length;
                    answer.count = answer.updatedIds.length;
                    answer.message = "Records(" + answer.count + ") updated in table '" + requestInfo.tableName + "'.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncPatch = function (requestInfo) {
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var columnProperties = this.dao.columnProperties(requestInfo);
        var identityColumn = this.dao.primaryKeyColumnName(requestInfo);
        var answer = new custom_1.JsonResult(requestInfo);
        var postBody = requestInfo.updateBody;
        var self = this;
        var promises = [];
        if (postBody instanceof Array) {
            //Jeroen: wat doen met postBodies zonder pk id => niet gebruiken?
            postBody.forEach(function (postItem) { return promises.push(self.asyncPatchOne(requestInfo, postItem[identityColumn], postItem, identityColumn, answer)); });
            return Promise.all(promises);
        }
        else {
            if (postBody[identityColumn]) {
                return this.asyncPatchOne(requestInfo, postBody[identityColumn], postBody, identityColumn, answer);
            }
            else
                return this.asyncPatchAll(requestInfo, postBody, answer);
        }
    };
    ApiDbHandler.prototype.asyncPutOne = function (requestInfo, body, identityColumn, answer) {
        var self = this;
        if (!body.hasOwnProperty(identityColumn)) {
            return new Promise(function (resolve, reject) {
                self.dao.updateItem(requestInfo, body[identityColumn], body, function (error, result) {
                    if (error)
                        reject(error);
                    if (result) {
                        answer.updatedIds.push(body[identityColumn]);
                        answer.updated++;
                        answer.count++;
                        resolve(answer);
                    }
                });
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                self.dao.addItem(requestInfo, body, function (error, result) {
                    if (error)
                        reject(error);
                    if (result) {
                        answer.createdIds.push(result);
                        answer.created++;
                        answer.count++;
                        resolve(result);
                    }
                });
            });
        }
    };
    ApiDbHandler.prototype.asyncPatchId = function (requestInfo) {
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var identityColumn = this.dao.primaryKeyColumnName(requestInfo);
        var answer = new custom_1.JsonResult(requestInfo);
        return this.asyncPatchOne(requestInfo, requestInfo.id, requestInfo.updateBody, identityColumn, answer);
    };
    ApiDbHandler.prototype.asyncExistId = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.itemExists(requestInfo, requestInfo.id, function (error, result) {
                if (error)
                    reject(error);
                answer.count = result;
                resolve(answer);
            });
        });
    };
    ApiDbHandler.prototype.asyncPutId = function (requestInfo) {
        return this.asyncPatchId(requestInfo);
    };
    // Dao calls
    // Get all documents/rows as json Response 
    // @param collectionID is the name/id of the container / collection
    // @param request is the request information send by the client
    ApiDbHandler.prototype.asyncGet = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.getAllItems(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.rows = result;
                    answer.count = result.length;
                    answer.message = answer.count + " records received.";
                    resolve(answer);
                }
            });
        });
    };
    // Get one json item Response with an id from request.params.id
    // @param collectionID is the name/id of the container / collection
    // @param request is the request information send by the client
    ApiDbHandler.prototype.asyncGetId = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.getItem(requestInfo, requestInfo.id, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.rows = result;
                    answer.count = answer.rows.length;
                    answer.message = answer.count + " record received.";
                }
                else
                    answer.unUsedIds.push(requestInfo.id);
                resolve(answer);
            });
        });
    };
    // Count table rows or documents 
    // @param collectionID is the name/id of the container / collection
    // @param request is the request information send by the client
    ApiDbHandler.prototype.asyncCount = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.countItems(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result)
                    answer.count = result;
                answer.count = 0;
                answer.message = answer.count + " records counted.";
                resolve(answer);
            });
        });
    };
    // Delete one json Response with an id from request.params.id
    // @param collectionID is the name/id of the container / collection
    // @param request is the request information send by the client
    ApiDbHandler.prototype.asyncDeleteId = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.deleteItem(requestInfo, requestInfo.id, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.deletedIds.push(result);
                    answer.deleted++;
                    answer.message = answer.deleted + " records deleted.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncCreateTable = function (requestInfo) {
        var _this = this;
        if (this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " already exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.createTable(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.message = result;
                    answer.message = "'" + (_this.config.isSql ? "Table" : "Collection") + "' '" + requestInfo.originalUnitId + "' created.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncDeleteTable = function (requestInfo) {
        var _this = this;
        if (!this.dao.tableExists(requestInfo))
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Cannot delete table " + (requestInfo.tableName) + ". Table does not exist."));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.deleteTable(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.message = result;
                    answer.message = "'" + (_this.config.isSql ? "Table" : "Collection") + "' '" + requestInfo.tableName + "' deleted.";
                    resolve(answer);
                }
                else {
                    answer.message = "'" + (_this.config.isSql ? "Table" : "Collection") + "' '" + requestInfo.tableName + "' is not deleted.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncCreateColumn = function (requestInfo) {
        var _this = this;
        if (!this.config.isSql)
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Due to the nature of " + this.config.databaseType + ", this action is not needed!"));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.createColumn(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.message = result;
                    answer.message = "Column '" + requestInfo.columnName + "' of datatype '" + requestInfo.dataType + "' created in table '" + requestInfo.tableName + "'.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncCreateForeignKey = function (requestInfo) {
        var _this = this;
        if (!this.config.isSql)
            return Promise.resolve(new custom_1.JsonResult(requestInfo, "Due to the nature of " + this.config.databaseType + ", this action is not needed!"));
        var answer = new custom_1.JsonResult(requestInfo);
        return new Promise(function (resolve, reject) {
            _this.dao.createForeignKey(requestInfo, function (error, result) {
                if (error)
                    reject(error);
                if (result) {
                    answer.message = result;
                    answer.message = "Foreign key '" + requestInfo.targetTable + "ID' of datatype '" + requestInfo.dataType + "' created in table '" + requestInfo.tableName + "'.";
                    resolve(answer);
                }
            });
        });
    };
    ApiDbHandler.prototype.asyncPromiseMessage = function (requestInfo, message) {
        return Promise.resolve(new custom_1.JsonResult(requestInfo, message));
    };
    return ApiDbHandler;
}());
exports.ApiDbHandler = ApiDbHandler;
//# sourceMappingURL=apiDbHandler.js.map