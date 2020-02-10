import { daoMongoDB } from "./daoMongoDB";
import { daoSQLite } from "./daoSQLite";
import { daoMySQL } from "./daoMySQL";
import { daoMSSQL } from "./daoMSSQL";
import { factory } from "../setup/factory";
import { SQLApiHander } from "../apiHandlers/SQLApiHandler";

export class ApiFactoryHandler {
  public static config: factory.Configuration;
  public static GetDbApiHandler(server:any, config: factory.Configuration, status: factory.RunningStatus, callback?: {(server):void } ) {
    console.log(`Starting ${config.databaseType} api server`);
    switch (config.databaseType) {    
      case factory.enums.enumDatabaseType.MongoDb:
        return new SQLApiHander( new daoMongoDB(server, config, status, callback));
        break;
      case factory.enums.enumDatabaseType.SQLite:
        return new SQLApiHander( new daoSQLite(server, config,status, callback));
        break;
      case factory.enums.enumDatabaseType.SQLiteMemory:
        return new SQLApiHander( new daoSQLite(server, config,status, callback));
        break;
      case factory.enums.enumDatabaseType.MySQL:
        return new SQLApiHander( new daoMySQL(server, config,status, callback));
        break;
      case factory.enums.enumDatabaseType.MSSQL:
        return new SQLApiHander( new daoMSSQL(server, config,status, callback));
        break;
    }
  }
}
