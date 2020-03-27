"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enumApiActions;
(function (enumApiActions) {
    enumApiActions[enumApiActions["Create"] = 0] = "Create";
    enumApiActions[enumApiActions["Read"] = 1] = "Read";
    enumApiActions[enumApiActions["Update"] = 2] = "Update";
    enumApiActions[enumApiActions["Delete"] = 3] = "Delete";
    enumApiActions[enumApiActions["Count"] = 4] = "Count";
    enumApiActions[enumApiActions["System"] = 5] = "System";
    enumApiActions[enumApiActions["Error"] = 6] = "Error";
})(enumApiActions = exports.enumApiActions || (exports.enumApiActions = {}));
var enumOperationMode;
(function (enumOperationMode) {
    enumOperationMode["Default"] = "Configuration Mode";
    enumOperationMode["ReadOnly"] = "Readonly apis for ever table.";
    enumOperationMode["ReadWrite"] = "Read and write apis for every table.";
    enumOperationMode["Admin"] = "Admin mode. Read, write and create tables.";
})(enumOperationMode = exports.enumOperationMode || (exports.enumOperationMode = {}));
var enumDatabaseType;
(function (enumDatabaseType) {
    enumDatabaseType["MongoDb"] = "Mongo database";
    enumDatabaseType["CosmosDb"] = "Cosmos DB";
    enumDatabaseType["SQLite"] = "SQLite 3";
    enumDatabaseType["SQLiteMemory"] = "SQLite 3 in Memory";
    enumDatabaseType["MySQL"] = "MySQL server";
    enumDatabaseType["MariaDB"] = "Maria DB server";
    enumDatabaseType["MSSQL"] = "Microsoft SQL server";
})(enumDatabaseType = exports.enumDatabaseType || (exports.enumDatabaseType = {}));
var enumRunningStatus;
(function (enumRunningStatus) {
    enumRunningStatus["Down"] = "Down";
    enumRunningStatus["Initializing"] = "Initializing";
    enumRunningStatus["ApiServerInitializing"] = "ApiServer is initializing";
    enumRunningStatus["DbConnectInitializing"] = "Database connection is initializing";
    enumRunningStatus["DbConnectConnected"] = "Database is Connected";
    enumRunningStatus["ApiServerUp"] = "ApiServer is Up";
    enumRunningStatus["ApiServerError"] = "ApiServer Error";
    enumRunningStatus["DbConnectError"] = "Database connection Error";
    enumRunningStatus["UpAndConnected"] = "Up and Running";
})(enumRunningStatus = exports.enumRunningStatus || (exports.enumRunningStatus = {}));
//# sourceMappingURL=enums.js.map