"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var daoMongoDB_1 = require("./daoMongoDB");
var daoSQLite_1 = require("./daoSQLite");
var daoMySQL_1 = require("./daoMySQL");
var daoMSSQL_1 = require("./daoMSSQL");
var factory_1 = require("../setup/factory");
var SQLApiHandler_1 = require("../apiHandlers/SQLApiHandler");
var ApiFactoryHandler = /** @class */ (function () {
    function ApiFactoryHandler() {
    }
    ApiFactoryHandler.GetDbApiHandler = function (server, config, status, callback) {
        console.log("Starting " + config.databaseType + " api server");
        switch (config.databaseType) {
            case factory_1.factory.enums.enumDatabaseType.MongoDb:
                return new SQLApiHandler_1.SQLApiHander(new daoMongoDB_1.daoMongoDB(server, config, status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.SQLite:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.daoSQLite(server, config, status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.SQLiteMemory:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.daoSQLite(server, config, status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.MySQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMySQL_1.daoMySQL(server, config, status, callback));
                break;
            case factory_1.factory.enums.enumDatabaseType.MSSQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMSSQL_1.daoMSSQL(server, config, status, callback));
                break;
        }
    };
    return ApiFactoryHandler;
}());
exports.ApiFactoryHandler = ApiFactoryHandler;
//# sourceMappingURL=daoSupport.js.map