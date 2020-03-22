"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $$ = require("./ApiMatic");
var keuze = 1;
var mode = 4;
var config;
switch (keuze) {
    // localhost
    case 0:
        config = $$.defaultConfig;
        break;
    case 1:
        config = $$.jalMSSQL;
        break;
    case 2:
        config = $$.jalMSSQL;
        break;
    case 3:
        config = $$.jalMariaDB;
        break;
    case 4:
        config = $$.jalMongo;
        break;
    case 5:
        config = $$.jalCosmos;
        break;
    case 6:
        config = $$.jalMongoCosmos;
        break;
        config = null;
    case 8:
        config = null;
        break;
    case 9:
        config = null;
        break;
    case 10:
        config = null;
        break;
    //JALDevelop
    case 11:
        config = $$.JALDEVELOPMSSQL;
        break;
    case 12:
        config = $$.JALDEVELOPMySQL;
        break;
    case 13:
        config = $$.JALDEVELOPMariaDB;
        break;
    case 14:
        config = $$.JALDEVELOPMongo;
        break;
    case 15:
        config = null;
        break;
}
var i = 6800;
switch (mode) {
    case 0:
        $$.connect(config, i++, function (error, router) { return configStart(error, router); });
        break;
    case 1:
        $$.connectReadonly(config, i++);
        break;
    case 2:
        $$.connectReadWrite(config, i++);
        break;
    case 3:
        $$.connectAdmin(config, i++);
    case 4:
        $$.connectSQLiteMemory(i++);
}
var configStart = function (error, router) {
    router.GetId("Branch");
    router.Post("Branch");
};
// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator
// $$.ConnectAdmin();
// $$.Connect($$.jalMySQL);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);
//# sourceMappingURL=index.js.map