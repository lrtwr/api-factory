import { JALDEVELOPMariaDB } from './ApiMatic';
import { Configuration } from './base/custom';
import * as $$ from "./ApiMatic"


let i=6800;
//$$.connectSQLiteMemory(i++);
$$.connect($$.defaultConfig,i++);

//$$.connectAdmin($$.JALDEVELOPMySQL,i++);
//$$.connectAdmin($$.JALDEVELOPMariaDB,i++);

$$.connectAdmin($$.JALDEVELOPMSSQL,i++);

//  $$.connectAdmin($$.JALDEVELOPMongo,i++);
// $$.connectAdmin($$.jalCosmos,i++);



// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator


// $$.ConnectAdmin();
//$$.connectAdmin($$.jalMySQL,i++);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);