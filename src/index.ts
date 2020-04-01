import { jalDevelopMariaDB } from './ApiMatic';
import { Configuration } from './base/custom';
import * as $$ from "./ApiMatic"


let i=6800;
//$$.connectSQLiteMemory(i++);
$$.connect($$.jalMSSQL,i++);

// $$.connectAdmin($$.jalDevelopMySQL,i++);
// $$.connectAdmin($$.jalDevelopMariaDB,i++);

//$$.connectAdmin($$.jalDevelopMSSQL,i++);

//  $$.connectAdmin($$.jalDevelopMongo,i++);
// $$.connectAdmin($$.jalCosmos,i++);



// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator


// $$.ConnectAdmin();
//$$.connectAdmin($$.jalMySQL,i++);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);