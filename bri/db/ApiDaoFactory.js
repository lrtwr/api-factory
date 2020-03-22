"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var daoCosmos_1 = require("./daoCosmos");
var daoMongoDB_1 = require("./daoMongoDB");
var daoSQLite_1 = require("./daoSQLite");
var daoMySQL_1 = require("./daoMySQL");
var daoMSSQL_1 = require("./daoMSSQL");
var enums_1 = require("../base/enums");
var apiDbHandler_1 = require("./apiDbHandler");
var ApiDaoFactory = /** @class */ (function () {
    function ApiDaoFactory() {
    }
    // static GetResponsDirector = (server: ApiServer, callback?: { (server: any): void }) => {
    //   if (!callback) callback = (routing) => {
    //     routing.AllTablesApis();
    //     routing.FinalizeRouting();
    //   };
    //   switch (server.config.databaseType) {
    //     case enumDatabaseType.MongoDb:
    //       return new ResponseDirector(new ApiDbHandler(new DaoMongo(server,callback), server, callback))
    //       break;
    //     case enumDatabaseType.CosmosDb:
    //       return new ResponseDirector(new ApiDbHandler(new DaoCosmos(server,callback), server, callback))
    //       //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
    //       break;
    //     case enumDatabaseType.SQLite:
    //       return new ResponseDirector(new ApiDbHandler(new DaoSQLite(server,callback), server, callback));
    //       break;
    //     case enumDatabaseType.SQLiteMemory:  //jeroen SQLITE in Memory nog regelen
    //       return new ResponseDirector(new ApiDbHandler(new DaoSQLite(server,callback), server, callback));
    //       break;
    //     case enumDatabaseType.MySQL:
    //       return new ResponseDirector(new ApiDbHandler(new DaoMySQL(server,callback), server, callback));
    //       break;
    //     case enumDatabaseType.MSSQL:
    //       return new ResponseDirector(new ApiDbHandler(new DaoMSSQL(server,callback), server, callback));
    //       break;
    //   }
    // }
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
            case enums_1.enumDatabaseType.MSSQL:
                return new apiDbHandler_1.ApiDbHandler(new daoMSSQL_1.DaoMSSQL(server, server.callback), server);
                break;
        }
    };
    return ApiDaoFactory;
}());
exports.ApiDaoFactory = ApiDaoFactory;
//# sourceMappingURL=ApiDaoFactory.js.map