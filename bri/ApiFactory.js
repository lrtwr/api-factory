"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiServer_1 = require("./imp/ApiServer");
var enums_1 = require("./base/enums");
var custom_1 = require("./base/custom");
exports.CreateMSSQLConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MSSQL;
    custom_1.cloneObjectInfo(config, cfg);
    return cfg;
};
exports.CreateMySQLConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MySQL;
    custom_1.cloneObjectInfo(config, cfg);
    return cfg;
};
exports.CreateSQLiteConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.SQLite;
    custom_1.cloneObjectInfo(config, cfg);
    return cfg;
};
exports.CreateCosmosConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.CosmosDb;
    custom_1.cloneObjectInfo(config, cfg);
    return cfg;
};
exports.CreateMongoConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MongoDb;
    custom_1.cloneObjectInfo(config, cfg);
    return cfg;
};
exports.defaultConfig = exports.CreateSQLiteConfiguration({
    listenPort: 6800,
    database: "./node_modules/apimatic/apimatic.db"
});
exports.Connect = function (config, callback) {
    if (config === void 0) { config = exports.defaultConfig; }
    config.operationMode = enums_1.enumOperationMode.Default;
    var server = new ApiServer_1.ApiServer(config, callback);
    return server;
};
exports.ConnectReadonly = function (config) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadOnly;
    var server = new ApiServer_1.ApiServer(config, callback);
    return server;
};
exports.ConnectReadWrite = function (config) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadWrite;
    var server = new ApiServer_1.ApiServer(config, callback);
    return server;
};
exports.ConnectAdmin = function (config) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.Admin;
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
    listenPort: 6806
});
exports.JALDEVELOPMySQL = exports.CreateMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3307,
    listenPort: 6807
});
exports.JALDEVELOPMSSQL = exports.CreateMSSQLConfiguration({
    listenPort: 6808,
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
exports.jalCosmos = exports.CreateCosmosConfiguration({
    host: "https://localhost:8081/",
    authKey: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    databaseId: "AngSQL",
    listenPort: 6810
});
// werkt nog niet
exports.jalMongoCosmos = exports.CreateMongoConfiguration({
    connectionString: "mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true",
    database: "ToDoList",
    listenPort: 6811
});
//mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
// export const $$ = module.exports;
// export const $ = module.exports;
// export const ApiMatic = module.exports;
//# sourceMappingURL=ApiFactory.js.map