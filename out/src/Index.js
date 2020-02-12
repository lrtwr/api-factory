"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiServer_1 = require("./imp/ApiServer");
var enums_1 = require("./base/enums");
var factory_1 = require("./base/factory");
var ApiRouting_1 = require("./imp/ApiRouting");
exports.ApiRouting = ApiRouting_1.ApiRouting;
var daoSupport_1 = require("./db/daoSupport");
exports.ApiFactoryHandler = daoSupport_1.ApiFactoryHandler;
var ApiFactory = /** @class */ (function () {
    function ApiFactory() {
        this.CreateMySQLConfiguration = function (config) {
            var cfg = new factory_1.Configuration();
            cfg.databaseType = enums_1.enumDatabaseType.MySQL;
            cfg.database = config.database;
            cfg.host = config.host;
            cfg.user = config.user;
            cfg.port = config.port;
            cfg.password = config.password;
            cfg.listenPort =
                config.listenPort != null ? config.listenPort : 5000;
            return cfg;
        };
        this.CreateMongoConfiguration = function (config) {
            var cfg = new factory_1.Configuration();
            cfg.databaseType = enums_1.enumDatabaseType.MongoDb;
            cfg.connectionString = config.connectionString;
            cfg.database = config.database;
            cfg.listenPort =
                config.listenPort != null ? config.listenPort : 5000;
            return cfg;
        };
        this.Connect = function (config, callback) {
            var server = new ApiServer_1.ApiServer(config, callback);
            return server;
        };
    }
    ApiFactory.prototype.CreateMSSQLConfiguration = function (config) {
        var cfg = new factory_1.Configuration();
        cfg.databaseType = enums_1.enumDatabaseType.MSSQL;
        cfg.database = config.database;
        cfg.server = config.server;
        cfg.user = config.user;
        cfg.password = config.password;
        cfg.listenPort = config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    ApiFactory.prototype.CreateSQLiteConfiguration = function (config) {
        var cfg = new factory_1.Configuration();
        cfg.databaseType = enums_1.enumDatabaseType.SQLite;
        cfg.connectionString = config.connectionString;
        cfg.database = config.database;
        cfg.listenPort =
            config.listenPort != null ? config.listenPort : 5000;
        return cfg;
    };
    return ApiFactory;
}());
exports.ApiFactory = ApiFactory;
var api = new ApiFactory();
// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql",
// port: 3306});
// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Ma#14Jovibo",
//   host: "127.0.0.1",
//   listenPort: 9000,
//   database: "angsql",
//   port: 3307
// });
exports.defaultSQLite = api.CreateSQLiteConfiguration({
    connectionString: "Data Source=apisqlite.db;",
    listenPort: 6802,
    database: "apisqlite.db"
});
exports.defaultMariaDB = api.CreateMySQLConfiguration({
    user: "root",
    password: "Ma#14Jovibo",
    host: "localhost",
    listenPort: 6800,
    database: "angsql",
    port: 3307
});
exports.defaultMSSQL = api.CreateMSSQLConfiguration({
    listenPort: 6801,
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
});
exports.defaultMongoExtern1 = api.CreateMongoConfiguration({
    connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-1m6kn.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",
    database: "AngSQL",
    listenPort: 6803
});
exports.defaultMongoExtern2 = api.CreateMongoConfiguration({
    connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-w2idf.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true",
    database: "AngSQL",
    listenPort: 6804
});
exports.defaultMongoLocal = api.CreateMongoConfiguration({
    connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL",
    listenPort: 6805
});
api.Connect(exports.defaultMSSQL);
api.Connect(exports.defaultMariaDB);
api.Connect(exports.defaultMongoExtern1);
api.Connect(exports.defaultSQLite);
//# sourceMappingURL=Index.js.map