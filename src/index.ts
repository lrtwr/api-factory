import { Configuration } from './base/custom';
import * as $$ from "./ApiMatic"
const keuze: number = 1;
const mode: number = 4;
var config: Configuration;
switch (keuze) {
    // localhost
    case 0:
        config = $$.defaultConfig;
        break;
    case 1:
        config = $$.jalMSSQL;
        break;
    case 2:
        config = $$.jalMSSQL
        break;
    case 3:
        config = $$.jalMariaDB
        break;
    case 4:
        config = $$.jalMongo
        break;
    case 5:
        config = $$.jalCosmos
        break;
    case 6:
        config = $$.jalMongoCosmos
        break;
        config = null
    case 8:
        config = null
        break;
    case 9:
        config = null
        break;
    case 10:
        config = null
        break;
    //JALDevelop
    case 11:
        config = $$.JALDEVELOPMSSQL
        break;
    case 12:
        config = $$.JALDEVELOPMySQL
        break;
    case 13:
        config = $$.JALDEVELOPMariaDB
        break;
    case 14:
        config = $$.JALDEVELOPMongo
        break;
    case 15:
        config = null
        break;
}
let i = 6800;
switch (mode) {
    case 0:
        $$.connect(config,i++, (error, router)=>configStart(error,router));
        break;
    case 1:
        $$.connectReadonly(config,i++);
        break;
    case 2:
        $$.connectReadWrite(config,i++);
        break;
    case 3:
        $$.connectAdmin(config,i++);
    case 4:
        $$.connectSQLiteMemory(i++)
}

const configStart = (error: Error, router: any)=>{
    router.GetId("Branch");
    router.Post("Branch");

}




// $$.Connect($$.jalMongoCosmos);  //werkt niet met emulator


// $$.ConnectAdmin();
// $$.Connect($$.jalMySQL);
// $$.Connect($$.jalMSSQL);
//$$.ConnectAdmin($$.jalMongo);
// $$.Connect($$.jalCosmos);