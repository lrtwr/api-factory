"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $$ = require("./ApiMatic");
var i = 6800;
//$$.connectSQLiteMemory(i++,true);
$$.connectAdmin($$.JALDEVELOPMSSQL, i++, true);
$$.connectAdmin($$.JALDEVELOPMySQL, i++, true);
$$.connectAdmin($$.JALDEVELOPMariaDB, i++, true);
$$.connectAdmin($$.JALDEVELOPMongo, i++, true);
$$.connectAdmin($$.jalCosmos, i++, true);
// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator
// $$.ConnectAdmin();
// $$.Connect($$.jalMySQL);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);
//# sourceMappingURL=index.js.map