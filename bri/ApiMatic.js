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
exports.createMariaDBConfiguration = function (config) {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.MariaDB;
    custom_1.CloneObjectInfo(config, cfg);
    return cfg;
};
function createSQLiteInMemoryConfiguration() {
    var cfg = new custom_1.Configuration();
    cfg.databaseType = enums_1.enumDatabaseType.SQLiteMemory;
    cfg.database = ":memory:";
    return cfg;
}
exports.createSQLiteInMemoryConfiguration = createSQLiteInMemoryConfiguration;
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
    database: "./apimatic.db"
    //database: "./node_modules/apimatic/apimatic.db"
});
exports.connect = function (config, listenPort, callback, multiProcessing) {
    if (config === void 0) { config = exports.defaultConfig; }
    if (multiProcessing === void 0) { multiProcessing = false; }
    config.operationMode = enums_1.enumOperationMode.Default;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback);
    return server;
};
exports.connectReadonly = function (config, listenPort, multiProcessing) {
    if (config === void 0) { config = exports.defaultConfig; }
    if (multiProcessing === void 0) { multiProcessing = false; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadOnly;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback, multiProcessing);
    return server;
};
exports.connectReadWrite = function (config, listenPort, multiProcessing) {
    if (config === void 0) { config = exports.defaultConfig; }
    if (multiProcessing === void 0) { multiProcessing = false; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.ReadWrite;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback, multiProcessing);
    return server;
};
exports.connectAdmin = function (config, listenPort, multiProcessing) {
    if (config === void 0) { config = exports.defaultConfig; }
    if (multiProcessing === void 0) { multiProcessing = false; }
    var callback = function () { };
    config.operationMode = enums_1.enumOperationMode.Admin;
    var server = new ApiServer_1.ApiServer(config, listenPort, callback, multiProcessing);
    return server;
};
exports.connectSQLiteMemory = function (listenPort, multiProcessing) {
    if (multiProcessing === void 0) { multiProcessing = false; }
    exports.connectAdmin(createSQLiteInMemoryConfiguration(), listenPort, multiProcessing);
};
exports.SQLiteMemory = createSQLiteInMemoryConfiguration();
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
    database: "ApiMatic",
    user: "sa",
    password: "Jovibo",
    server: "JAL"
    // server: "127.0.0.1"
    // server: "localhost"
});
exports.jalMongo = exports.createMongoConfiguration({
    connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    database: "AngSQL"
});
exports.jalSQLite = exports.createSQLiteConfiguration({
    database: "apisqlite.db"
});
exports.jalDevelopMySQL = exports.createMySQLConfiguration({
    host: "192.168.178.7",
    user: "root",
    database: "angsql",
    password: "",
    port: 3306
});
exports.jalDevelopMariaDB = exports.createMariaDBConfiguration({
    host: "JALDEVELOP",
    user: "root",
    database: "angsql",
    password: "",
    port: 3307
});
exports.jalDevelopMSSQL = exports.createMSSQLConfiguration({
    database: "angsql",
    user: "sa",
    password: "Jovibo",
    server: "JALDEVELOP"
});
exports.jalDevelopMariaDBLocalHost = exports.createMariaDBConfiguration({
    host: "localhost",
    user: "root",
    database: "angsql",
    password: "",
    port: 3307
});
exports.jalDevelopMSSQLLocalHost = exports.createMSSQLConfiguration({
    database: "angsql",
    user: "sa",
    password: "Jovibo",
    server: "localhost"
});
exports.jalDevelopMongo = exports.createMongoConfiguration({
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