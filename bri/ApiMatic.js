"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiServer_1 = require("./imp/ApiServer");
var enums_1 = require("./base/enums");
var custom_1 = require("./base/custom");
exports.createMSSQLConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MSSQL;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
exports.createMySQLConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MySQL;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
exports.createSQLiteInMemoryConfiguration = function () {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.SQLiteMemory;
    cfg.database = ":memory:";
    return cfg;
};
exports.createSQLiteConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.SQLite;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
exports.createCosmosConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.CosmosDb;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
exports.createMongoConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MongoDb;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
exports.defaultConfig = exports.createSQLiteConfiguration({
    database: "./node_modules/apimatic/apimatic.db"
});
exports.connect = function (config, listenPort, callback) {
    if (config === void 0) { config = exports.defaultConfig; }
    config.operationMode = enums_1.enumOperationMode.Default;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback);
    return server;
};
exports.connectReadonly = function (config, listenPort) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadOnly;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback);
    return server;
};
exports.connectReadWrite = function (config, listenPort) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadWrite;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback);
    return server;
};
exports.connectAdmin = function (config, listenPort) {
    if (config === void 0) { config = exports.defaultConfig; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.Admin;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback);
    return server;
};
exports.connectSQLiteMemory = function (listenPort) {
    exports.connectAdmin(exports.createSQLiteInMemoryConfiguration(), listenPort);
};
exports.SQLiteMemory = exports.createSQLiteInMemoryConfiguration();
exports.jalMariaDB = exports.createMySQLConfiguration({
    user: "root",
    password: "",
    host: "localhost",
    database: "angsql",
    port: 3307
});
exports.jalMySQL = exports.createMySQLConfiguration({
    user: "root",
    password: "",
    host: "localhost",
    database: "angsql",
    port: 3306
});
exports.jalMSSQL = exports.createMSSQLConfiguration({
    database: "AngSQL",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
});
exports.jalMongo = exports.createMongoConfiguration({
    connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL"
});
exports.jalSQLite = exports.createSQLiteConfiguration({
    database: "apisqlite.db"
});
exports.JALDEVELOPMariaDB = exports.createMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3306
});
exports.JALDEVELOPMySQL = exports.createMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3307
});
exports.JALDEVELOPMSSQL = exports.createMSSQLConfiguration({
    database: "angsql",
    user: "sa",
    password: "Jovibo",
    server: "JALDEVELOP"
});
exports.JALDEVELOPMongo = exports.createMongoConfiguration({
    connectionString: "mongodb://192.168.178.7:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL"
});
exports.jalCosmos = exports.createCosmosConfiguration({
    host: "https://localhost:8081/",
    authKey: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    databaseId: "AngSQL"
});
// werkt nog niet
exports.jalMongoCosmos = exports.createMongoConfiguration({
    connectionString: "mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true",
    database: "ToDoList"
});
//# sourceMappingURL=ApiMatic.js.map