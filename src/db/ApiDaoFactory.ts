import { ApiServer } from './../imp/ApiServer';
import { DaoCosmos} from './daoCosmos';
import { DaoMongo } from "./daoMongoDB";
import { DaoSQLite  } from "./daoSQLite";
import { DaoMySQL } from "./daoMySQL";
import { DaoMSSQL } from "./daoMSSQL";
import { ResponseDirector } from "../base/responseDirector";
import { enumDatabaseType } from "../base/enums";
import { ApiDbHandler } from './apiDbHandler';
import { AbstractApiRouting } from '../imp/ApiRouting';

export class ApiDaoFactory {
  // static GetResponsDirector = (server: ApiServer, callback?: { (server: any): void }) => {
  //   if (!callback) callback = (routing) => {
  //     routing.AllTablesApis();
  //     routing.FinalizeRouting();
  //   };
  //   switch (server.config.databaseType) {
  //     case enumDatabaseType.MongoDb:
  //       return new ResponseDirector(new ApiDbHandler(new DaoMongo(server,callback), server, callback))
  //       break;
  //     case enumDatabaseType.CosmosDb:
  //       return new ResponseDirector(new ApiDbHandler(new DaoCosmos(server,callback), server, callback))
  //       //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
  //       break;
  //     case enumDatabaseType.SQLite:
  //       return new ResponseDirector(new ApiDbHandler(new DaoSQLite(server,callback), server, callback));
  //       break;
  //     case enumDatabaseType.SQLiteMemory:  //jeroen SQLITE in Memory nog regelen
  //       return new ResponseDirector(new ApiDbHandler(new DaoSQLite(server,callback), server, callback));
  //       break;
  //     case enumDatabaseType.MySQL:
  //       return new ResponseDirector(new ApiDbHandler(new DaoMySQL(server,callback), server, callback));
  //       break;
  //     case enumDatabaseType.MSSQL:
  //       return new ResponseDirector(new ApiDbHandler(new DaoMSSQL(server,callback), server, callback));
  //       break;
  //   }
  // }
  static GetApiDbHandler = (server: ApiServer) => {
    if (!server.callback) server.callback = (error:Error, routing: AbstractApiRouting) => {
      routing.allTablesApis();
      routing.finalizeRouting();
    };
    switch (server.config.databaseType) {
      case enumDatabaseType.MongoDb:
        return new ApiDbHandler(new DaoMongo(server,server.callback), server);
        break;
      case enumDatabaseType.CosmosDb:
        return new ApiDbHandler(new DaoCosmos(server,server.callback), server);
        //return new ResponseDirector(new DaoCosmos(server, server.config, server.status, callback));
        break;
      case enumDatabaseType.SQLite:
        return new ApiDbHandler(new DaoSQLite(server,server.callback), server);
        break;
      case enumDatabaseType.SQLiteMemory:  //jeroen SQLITE in Memory nog regelen
        return new ApiDbHandler(new DaoSQLite(server,server.callback), server);
        break;
        case enumDatabaseType.MySQL:
          return new ApiDbHandler(new DaoMySQL(server,server.callback), server);
          break;
          case enumDatabaseType.MariaDB:
            return new ApiDbHandler(new DaoMySQL(server,server.callback), server);
            break;
      case enumDatabaseType.MSSQL:
        return new ApiDbHandler(new DaoMSSQL(server,server.callback), server);
        break;
    }
  }
}
