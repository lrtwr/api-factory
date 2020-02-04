"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiFactory_1 = require("./ApiFactory");
var ApiFactory = /** @class */ (function () {
    function ApiFactory() {
    }
    ApiFactory.CreateMSSQLConfiguration = function (config) {
        this.lastConfig = new ApiFactory_1.factory.Configuration();
        this.lastConfig.databaseType = ApiFactory_1.factory.enumDatabaseType.MSSQL;
        this.lastConfig.database = config.database;
        this.lastConfig.server = config.server;
        this.lastConfig.user = config.user;
        this.lastConfig.password = config.password;
        this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
        this.configurations.push(this.lastConfig);
    };
    ApiFactory.CreateMySQLConfiguration = function (config) {
        this.lastConfig = new ApiFactory_1.factory.Configuration();
        this.lastConfig.databaseType = ApiFactory_1.factory.enumDatabaseType.MySQL;
        this.lastConfig.database = config.database;
        this.lastConfig.host = config.host;
        this.lastConfig.user = config.user;
        this.lastConfig.password = config.password;
        this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
        this.configurations.push(this.lastConfig);
    };
    ApiFactory.CreateSQLiteConfiguration = function (config) {
        this.lastConfig = new ApiFactory_1.factory.Configuration();
        this.lastConfig.databaseType = ApiFactory_1.factory.enumDatabaseType.SQLite;
        this.lastConfig.connectionString = config.connectionString;
        this.lastConfig.database = config.database;
        this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
        this.configurations.push(this.lastConfig);
    };
    ApiFactory.CreateMongoConfiguration = function (config) {
        this.lastConfig = new ApiFactory_1.factory.Configuration();
        this.lastConfig.databaseType = ApiFactory_1.factory.enumDatabaseType.MongoDb;
        this.lastConfig.connectionString = config.connectionString;
        this.lastConfig.database = config.database;
        this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
        this.configurations.push(this.lastConfig);
    };
    ApiFactory.CreateConfiguration = function () { };
    ApiFactory.Connect = function (callback) {
        this.lastServer = new ApiFactory_1.ApiRouting(this.lastConfig, callback);
        this.servers.push(this.lastServer);
    };
    ApiFactory.configurations = [];
    ApiFactory.servers = [];
    return ApiFactory;
}());
var mysqlConfig = {
    databaseType: ApiFactory_1.factory.enumDatabaseType.MySQL,
    user: "root",
    password: "Jovibo",
    host: "localhost",
    listenPort: 6000,
    database: "angsql"
};
var sqliteFileConfig = {
    databaseType: ApiFactory_1.factory.enumDatabaseType.SQLite,
    connectionString: "Data Source=apisqlite.db;",
    listenPort: 7000,
    database: "apisqlite.db"
};
var sqliteMemoryConfig = {
    databaseType: ApiFactory_1.factory.enumDatabaseType.SQLiteMemory,
    connectionString: "Data Source=apisqlite.db;Version=3;",
    listenPort: 5000,
    database: "apisqlite.db"
};
var mssqlConfig = {
    databaseType: ApiFactory_1.factory.enumDatabaseType.MSSQL,
    listenPort: 8000,
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
};
var api = ApiFactory;
api.CreateSQLiteConfiguration({
    connectionString: "Data Source=apisqlite.db;",
    listenPort: 7000,
    database: "apisqlite.db"
});
// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql"})
api.Connect();
//# sourceMappingURL=index.js.map