"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $$ = require("./ApiMatic");
var i = 6800;
//$$.connectSQLiteMemory(i++);
$$.connect($$.defaultConfig, i++);
//$$.connectAdmin($$.JALDEVELOPMySQL,i++);
//$$.connectAdmin($$.JALDEVELOPMariaDB,i++);
$$.connectAdmin($$.JALDEVELOPMSSQL, i++);
//  $$.connectAdmin($$.JALDEVELOPMongo,i++);
// $$.connectAdmin($$.jalCosmos,i++);
// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator
// $$.ConnectAdmin();
//$$.connectAdmin($$.jalMySQL,i++);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);
//# sourceMappingURL=index.js.map