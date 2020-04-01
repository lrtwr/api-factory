import { AbstractApiRouting } from '../imp/ApiRouting';
import { ApiDbHandler } from './apiDbHandler';
import { ApiServer } from './../imp/ApiServer';
import { DaoCosmos} from './daoCosmos';
import { DaoMongo } from "./daoMongoDB";
import { DaoMSSQL } from "./daoMSSQL";
import { DaoMySQL } from "./daoMySQL";
import { DaoSQLite  } from "./daoSQLite";
import { enumDatabaseType } from "../base/enums";

export class ApiDaoFactory {
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
