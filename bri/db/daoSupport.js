"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var daoCosmos_1 = require("./daoCosmos");
var daoMongoDB_1 = require("./daoMongoDB");
var daoSQLite_1 = require("./daoSQLite");
var daoMySQL_1 = require("./daoMySQL");
var daoMSSQL_1 = require("./daoMSSQL");
var ResponseDirector_1 = require("../base/ResponseDirector");
var enums_1 = require("../base/enums");
var apiDbHandler_1 = require("./apiDbHandler");
var ApiFactoryHandler = /** @class */ (function () {
    function ApiFactoryHandler() {
    }
    ApiFactoryHandler.GetResponsDirector = function (server, callback) {
        if (!callback)
            callback = function (routing) {
                routing.AllTablesApis();
                routing.FinalizeRouting();
            };
        switch (server.config.databaseType) {
            case enums_1.enumDatabaseType.MongoDb:
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoMongoDB_1.DaoMongo(server, callback), server, callback));
                break;
            case enums_1.enumDatabaseType.CosmosDb:
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoCosmos_1.DaoCosmos(server, callback), server, callback));
                //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.SQLite:
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, callback), server, callback));
                break;
            case enums_1.enumDatabaseType.SQLiteMemory: //jeroen SQLITE in Memory nog regelen
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, callback), server, callback));
                break;
            case enums_1.enumDatabaseType.MySQL:
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoMySQL_1.DaoMySQL(server, callback), server, callback));
                break;
            case enums_1.enumDatabaseType.MSSQL:
                return new ResponseDirector_1.ResponseDirector(new apiDbHandler_1.ApiDbHandler(new daoMSSQL_1.DaoMSSQL(server, callback), server, callback));
                break;
        }
    };
    ApiFactoryHandler.GetApiDbHandler = function (server, callback) {
        if (!callback)
            callback = function (routing) {
                routing.AllTablesApis();
                routing.FinalizeRouting();
            };
        switch (server.config.databaseType) {
            case enums_1.enumDatabaseType.MongoDb:
                return new apiDbHandler_1.ApiDbHandler(new daoMongoDB_1.DaoMongo(server, callback), server, callback);
                break;
            case enums_1.enumDatabaseType.CosmosDb:
                return new apiDbHandler_1.ApiDbHandler(new daoCosmos_1.DaoCosmos(server, callback), server, callback);
                //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
                break;
            case enums_1.enumDatabaseType.SQLite:
                return new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, callback), server, callback);
                break;
            case enums_1.enumDatabaseType.SQLiteMemory: //jeroen SQLITE in Memory nog regelen
                return new apiDbHandler_1.ApiDbHandler(new daoSQLite_1.DaoSQLite(server, callback), server, callback);
                break;
            case enums_1.enumDatabaseType.MySQL:
                return new apiDbHandler_1.ApiDbHandler(new daoMySQL_1.DaoMySQL(server, callback), server, callback);
                break;
            case enums_1.enumDatabaseType.MSSQL:
                return new apiDbHandler_1.ApiDbHandler(new daoMSSQL_1.DaoMSSQL(server, callback), server, callback);
                break;
        }
    };
    return ApiFactoryHandler;
}());
exports.ApiFactoryHandler = ApiFactoryHandler;
//# sourceMappingURL=daoSupport.js.map