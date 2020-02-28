"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiServer_1 = require("./imp/ApiServer");
var enums_1 = require("./base/enums");
var factory_1 = require("./base/factory");
exports.CreateMSSQLConfiguration = function (config) {
    var cfg = new factory_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MSSQL;
    cfg.database = config.database;
    cfg.server = config.server;
    cfg.user = config.user;
    cfg.password = config.password;
    cfg.listenPort = config.listenPort != null ? config.listenPort : 5000;
    return cfg;
};
exports.CreateMySQLConfiguration = function (config) {
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
exports.CreateSQLiteConfiguration = function (config) {
    var cfg = new factory_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.SQLite;
    cfg.database = config.database;
    cfg.listenPort =
        config.listenPort != null ? config.listenPort : 5000;
    return cfg;
};
exports.CreateMongoConfiguration = function (config) {
    var cfg = new factory_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MongoDb;
    cfg.connectionString = config.connectionString;
    cfg.database = config.database;
    cfg.listenPort =
        config.listenPort != null ? config.listenPort : 5000;
    return cfg;
};
exports.defaultConfig = exports.CreateSQLiteConfiguration({
    listenPort: 6800,
    database: "./node_modules/apimatic/apimatic.db"
});
exports.Connect = function (config, callback) {
    if (config === void 0) { config = exports.defaultConfig; }
    var server = new ApiServer_1.ApiServer(config, callback);
    return server;
};
exports.jalMariaDB = exports.CreateMySQLConfiguration({
    user: "root",
    password: "",
    host: "localhost",
    listenPort: 6801,
    database: "angsql",
    port: 3307
});
exports.jalMySQL = exports.CreateMySQLConfiguration({
    user: "root",
    password: "",
    host: "localhost",
    listenPort: 6802,
    database: "angsql",
    port: 3306
});
exports.jalMSSQL = exports.CreateMSSQLConfiguration({
    listenPort: 6803,
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
});
exports.jalMongo = exports.CreateMongoConfiguration({
    connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL",
    listenPort: 6804
});
exports.jalSQLite = exports.CreateSQLiteConfiguration({
    listenPort: 6805,
    database: "apisqlite.db"
});
exports.JALDEVELOPMariaDB = exports.CreateMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3306,
    listenPort: 6808
});
exports.JALDEVELOPMySQL = exports.CreateMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3307,
    listenPort: 6809
});
exports.JALDEVELOPMSSQL = exports.CreateMSSQLConfiguration({
    listenPort: 688,
    database: "angsql",
    user: "sa",
    password: "Jovibo",
    server: "JALDEVELOP"
});
exports.JALDEVELOPMongo = exports.CreateMongoConfiguration({
    connectionString: "mongodb://192.168.178.7:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL",
    listenPort: 6809
});
//mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
exports.$$ = module.exports;
exports.$ = module.exports;
exports.ApiMatic = module.exports;
//# sourceMappingURL=ApiFactory.js.map