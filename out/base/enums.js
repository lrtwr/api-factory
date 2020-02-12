"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enumApiActions;
(function (enumApiActions) {
    enumApiActions[enumApiActions["Create"] = 0] = "Create";
    enumApiActions[enumApiActions["Read"] = 1] = "Read";
    enumApiActions[enumApiActions["Update"] = 2] = "Update";
    enumApiActions[enumApiActions["Delete"] = 3] = "Delete";
    enumApiActions[enumApiActions["Count"] = 4] = "Count";
    enumApiActions[enumApiActions["Error"] = 5] = "Error";
})(enumApiActions = exports.enumApiActions || (exports.enumApiActions = {}));
var enumDatabaseType;
(function (enumDatabaseType) {
    enumDatabaseType["MongoDb"] = "Mongo database";
    enumDatabaseType["SQLite"] = "SQLite 3";
    enumDatabaseType["SQLiteMemory"] = "SQLite 3 in Memory";
    enumDatabaseType["MySQL"] = "MySQL server";
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