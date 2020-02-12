"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var daoMongoDB_1 = require("./daoMongoDB");
var daoSQLite_1 = require("./daoSQLite");
var daoMySQL_1 = require("./daoMySQL");
var daoMSSQL_1 = require("./daoMSSQL");
var factory_1 = require("../base/factory");
var SQLApiHandler_1 = require("../base/SQLApiHandler");
var ApiFactoryHandler;
(function (ApiFactoryHandler) {
    ApiFactoryHandler.GetDbApiHandler = function (server, callback) {
        if (!callback)
            callback = function (routing) {
                routing.AllTablesApis();
                routing.FinalizeRouting();
            };
        console.log("Starting " + server.config.databaseType + " api server");
        switch (server.config.databaseType) {
            case factory_1.factory.enums.enumDatabaseType.MongoDb:
                return new SQLApiHandler_1.SQLApiHander(new daoMongoDB_1.daoMongoDB(server, server.config, server.status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.SQLite:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.daoSQLite(server, server.config, server.status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.SQLiteMemory:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.daoSQLite(server, server.config, server.status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.MySQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMySQL_1.daoMySQL(server, server.config, server.status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.MSSQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMSSQL_1.daoMSSQL(server, server.config, server.status, callback));
                break;
        }
    };
})(ApiFactoryHandler = exports.ApiFactoryHandler || (exports.ApiFactoryHandler = {}));
//# sourceMappingURL=daoSupport.js.map