"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiFactory_1 = require("./ApiFactory");
var ApiFactory;
(function (ApiFactory) {
    ApiFactory.CreateMSSQLConfiguration = function (config) {
        var cfg = new ApiFactory_1.factory.Configuration();
        cfg.databaseType = ApiFactory_1.factory.enums.enumDatabaseType.MSSQL;
        cfg.database = config.database;
        cfg.server = config.server;
        cfg.user = config.user;
        cfg.password = config.password;
        cfg.listenPort = config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    ApiFactory.CreateMySQLConfiguration = function (config) {
        var cfg = new ApiFactory_1.factory.Configuration();
        cfg.databaseType = ApiFactory_1.factory.enums.enumDatabaseType.MySQL;
        cfg.database = config.database;
        cfg.host = config.host;
        cfg.user = config.user;
        cfg.port = config.port;
        cfg.password = config.password;
        cfg.listenPort =
            config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    ApiFactory.CreateSQLiteConfiguration = function (config) {
        var cfg = new ApiFactory_1.factory.Configuration();
        cfg.databaseType = ApiFactory_1.factory.enums.enumDatabaseType.SQLite;
        cfg.connectionString = config.connectionString;
        cfg.database = config.database;
        cfg.listenPort =
            config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    ApiFactory.CreateMongoConfiguration = function (config) {
        var cfg = new ApiFactory_1.factory.Configuration();
        cfg.databaseType = ApiFactory_1.factory.enums.enumDatabaseType.MongoDb;
        cfg.connectionString = config.connectionString;
        cfg.database = config.database;
        cfg.listenPort =
            config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    ApiFactory.Connect = function (config, callback) {
        var server = new ApiFactory_1.ApiRouting(config, callback);
        return server;
    };
})(ApiFactory = exports.ApiFactory || (exports.ApiFactory = {}));
var mysqlConfig = {
    databaseType: ApiFactory_1.factory.enums.enumDatabaseType.MySQL,
    user: "root",
    password: "Jovibo",
    host: "localhost",
    listenPort: 6000,
    database: "angsql"
};
var sqliteFileConfig = {
    databaseType: ApiFactory_1.factory.enums.enumDatabaseType.SQLite,
    connectionString: "Data Source=apisqlite.db;",
    listenPort: 7000,
    database: "apisqlite.db"
};
var sqliteMemoryConfig = {
    databaseType: ApiFactory_1.factory.enums.enumDatabaseType.SQLiteMemory,
    connectionString: "Data Source=apisqlite.db;Version=3;",
    listenPort: 5000,
    database: "apisqlite.db"
};
var mssqlConfig = {
    databaseType: ApiFactory_1.factory.enums.enumDatabaseType.MSSQL,
    listenPort: 8000,
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
};
exports.Connect = function (config, callback) {
    var server = new ApiFactory_1.ApiRouting(config, callback);
    return server;
};
var api = ApiFactory;
// api.CreateSQLiteConfiguration({
//   connectionString:"Data Source=apisqlite.db;",
//   listenPort: 7004,
//   database: "apisqlite.db"
// })
// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql",
// port: 3306});
// api.CreateMSSQLConfiguration({
//   listenPort:8000,
//   database: "AngSQL",
//   user:"sa",
//   password: "Jovibo",
//   server: "JAL"
// })
// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Ma#14Jovibo",
//   host: "127.0.0.1",
//   listenPort: 9000,
//   database: "angsql",
//   port: 3307
// });
// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Jovibo",
//   host: "127.0.0.1",
//   listenPort: 11000,
//   database: "angsql",
//   port: 3306
// });
var configSQLite = api.CreateSQLiteConfiguration({
    connectionString: "Data Source=apisqlite.db;",
    listenPort: 6802,
    database: "apisqlite.db"
});
var configMySQL = api.CreateMySQLConfiguration({
    user: "root",
    password: "Ma#14Jovibo",
    host: "localhost",
    listenPort: 6800,
    database: "angsql",
    port: 3307
});
var configMSSQL = api.CreateMSSQLConfiguration({
    listenPort: 6801,
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
});
var configMongo1 = api.CreateMongoConfiguration({
    connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-1m6kn.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",
    database: "AngSQL",
    listenPort: 6803
});
var configMongo2 = api.CreateMongoConfiguration({
    connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-w2idf.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true",
    database: "AngSQL",
    listenPort: 6804
});
var configMongo3 = api.CreateMongoConfiguration({
    connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL",
    listenPort: 6805
});
//api.Connect(configMySQL);
//api.Connect(configMSSQL);
api.Connect(configSQLite);
//api.Connect(configMongo1);
//# sourceMappingURL=index.js.map