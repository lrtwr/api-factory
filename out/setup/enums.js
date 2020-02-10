"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums;
(function (enums) {
    var enumApiActions;
    (function (enumApiActions) {
        enumApiActions[enumApiActions["Create"] = 0] = "Create";
        enumApiActions[enumApiActions["Read"] = 1] = "Read";
        enumApiActions[enumApiActions["Update"] = 2] = "Update";
        enumApiActions[enumApiActions["Delete"] = 3] = "Delete";
        enumApiActions[enumApiActions["Count"] = 4] = "Count";
        enumApiActions[enumApiActions["Error"] = 5] = "Error";
    })(enumApiActions = enums.enumApiActions || (enums.enumApiActions = {}));
    var enumDatabaseType;
    (function (enumDatabaseType) {
        enumDatabaseType["MongoDb"] = "Mongo database";
        enumDatabaseType["SQLite"] = "SQLite 3";
        enumDatabaseType["SQLiteMemory"] = "SQLite 3 in Memory";
        enumDatabaseType["MySQL"] = "MySQL server";
        enumDatabaseType["MSSQL"] = "Microsoft SQL server";
    })(enumDatabaseType = enums.enumDatabaseType || (enums.enumDatabaseType = {}));
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
    })(enumRunningStatus = enums.enumRunningStatus || (enums.enumRunningStatus = {}));
})(enums = exports.enums || (exports.enums = {}));
//# sourceMappingURL=enums.js.map