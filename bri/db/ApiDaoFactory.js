"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiDbHandler_1 = require("./apiDbHandler");
var daoCosmos_1 = require("./daoCosmos");
var daoMongoDB_1 = require("./daoMongoDB");
var daoMSSQL_1 = require("./daoMSSQL");
var daoMySQL_1 = require("./daoMySQL");
var daoSQLite_1 = require("./daoSQLite");
var enums_1 = require("../base/enums");
var ApiDaoFactory = /** @class */ (function () {
    function ApiDaoFactory() {
    }
    ApiDaoFactory.GetApiDbHandler = function (server) {
        if (!server.callback)
            server.callback = function (error, routing) {
                routing.allTablesApis();
                routing.finalizeRouting();
            };
        switch (server.config.databaseType) {
            case enums_1.enumDatabaseType.MongoDb:
                return new apiDbHandler_1.ApiDbHandler(new daoMongoDB_1.DaoMongo(server, server.callback), server);
                break;
            case enums_1.enumDatabaseType.CosmosDb:
                return new apiDbHandler_1.ApiDbHandler(new daoCosmos_1.DaoCosmos(server, server.callback), server);
                //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.SQLite:
                return new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, server.callback), server);
                break;
            case enums_1.enumDatabaseType.SQLiteMemory: //jeroen SQLITE in Memory nog regelen
                return new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, server.callback), server);
                break;
            case enums_1.enumDatabaseType.MySQL:
                return new apiDbHandler_1.ApiDbHandler(new daoMySQL_1.DaoMySQL(server, server.callback), server);
                break;
            case enums_1.enumDatabaseType.MariaDB:
                return new apiDbHandler_1.ApiDbHandler(new daoMySQL_1.DaoMySQL(server, server.callback), server);
                break;
            case enums_1.enumDatabaseType.MSSQL:
                return new apiDbHandler_1.ApiDbHandler(new daoMSSQL_1.DaoMSSQL(server, server.callback), server);
                break;
        }
    };
    return ApiDaoFactory;
}());
exports.ApiDaoFactory = ApiDaoFactory;
//# sourceMappingURL=ApiDaoFactory.js.map