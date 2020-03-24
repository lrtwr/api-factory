import { JALDEVELOPMariaDB } from './ApiMatic';
import { Configuration } from './base/custom';
import * as $$ from "./ApiMatic"


let i=6800;
//$$.connectSQLiteMemory(i++,true);

$$.connectAdmin($$.JALDEVELOPMSSQL,i++,true);
$$.connectAdmin($$.JALDEVELOPMySQL,i++,true);
$$.connectAdmin($$.JALDEVELOPMariaDB,i++,true);
 $$.connectAdmin($$.JALDEVELOPMongo,i++,true);
$$.connectAdmin($$.jalCosmos,i++,true);



// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator


// $$.ConnectAdmin();
// $$.Connect($$.jalMySQL);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);