import { DaoMongoDB } from "./daoMongoDB";
import { DaoSQLite } from "./daoSQLite";
import { DaoMySQL } from "./daoMySQL";
import { DaoMSSQL } from "./daoMSSQL";
import { SQLApiHander } from "../base/SQLApiHandler";
import { enumDatabaseType } from "../base/enums";

export class ApiFactoryHandler {
    static GetDbApiHandler = (server: any, callback?: { (server: any): void }) => {
    if (!callback) callback = (routing) => {
      routing.AllTablesApis();
      routing.FinalizeRouting();
    };
    switch (server.config.databaseType) {
      case enumDatabaseType.MongoDb:
        return new SQLApiHander(new DaoMongoDB(server, server.config, server.status, callback));
        break;
      case enumDatabaseType.SQLite:
        return new SQLApiHander(new DaoSQLite(server, server.config, server.status, callback));
        break;
      case enumDatabaseType.SQLiteMemory:
        return new SQLApiHander(new DaoSQLite(server, server.config, server.status, callback));
        break;
      case enumDatabaseType.MySQL:
        return new SQLApiHander(new DaoMySQL(server, server.config, server.status, callback));
        break;
      case enumDatabaseType.MSSQL:
        return new SQLApiHander(new DaoMSSQL(server, server.config, server.status, callback));
        break;
    }
  }
}
