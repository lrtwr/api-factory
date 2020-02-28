"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var daoMongoDB_1 = require("./daoMongoDB");
var daoSQLite_1 = require("./daoSQLite");
var daoMySQL_1 = require("./daoMySQL");
var daoMSSQL_1 = require("./daoMSSQL");
var SQLApiHandler_1 = require("../base/SQLApiHandler");
var enums_1 = require("../base/enums");
var ApiFactoryHandler = /** @class */ (function () {
    function ApiFactoryHandler() {
    }
    ApiFactoryHandler.GetDbApiHandler = function (server, callback) {
        if (!callback)
            callback = function (routing) {
                routing.AllTablesApis();
                routing.FinalizeRouting();
            };
        switch (server.config.databaseType) {
            case enums_1.enumDatabaseType.MongoDb:
                return new SQLApiHandler_1.SQLApiHander(new daoMongoDB_1.DaoMongoDB(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.SQLite:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.DaoSQLite(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.SQLiteMemory:
                return new SQLApiHandler_1.SQLApiHander(new daoSQLite_1.DaoSQLite(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.MySQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMySQL_1.DaoMySQL(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.MSSQL:
                return new SQLApiHandler_1.SQLApiHander(new daoMSSQL_1.DaoMSSQL(server, server.config, server.status, callback));
                break;
        }
    };
    return ApiFactoryHandler;
}());
exports.ApiFactoryHandler = ApiFactoryHandler;
//# sourceMappingURL=daoSupport.js.map