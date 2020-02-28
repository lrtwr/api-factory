import { ApiServer } from './imp/ApiServer';
import { enumDatabaseType } from './base/enums';
import { Configuration } from './base/factory';

export const CreateMSSQLConfiguration = (config: {
  server: string;
  database: string;
  user: string;
  password: string;
  listenPort?: number;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MSSQL;
  cfg.database = config.database;
  cfg.server = config.server;
  cfg.user = config.user;
  cfg.password = config.password;
  cfg.listenPort = config.listenPort != null ? config.listenPort : 5000;
  return cfg;
}


export const CreateMySQLConfiguration = (config: {
  host: string;
  database: string;
  user: string;
  port?: number;
  password?: string;
  listenPort?: number;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MySQL;
  cfg.database = config.database;
  cfg.host = config.host;
  cfg.user = config.user;
  cfg.port = config.port;
  cfg.password = config.password;
  cfg.listenPort =
    config.listenPort != null ? config.listenPort : 5000;
  return cfg;
}

export const CreateSQLiteConfiguration = (config: {
  database: string;
  listenPort?: number;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.SQLite;
  cfg.database = config.database;
  cfg.listenPort =
    config.listenPort != null ? config.listenPort : 5000;
  return cfg;
}

export const CreateMongoConfiguration = (config: {
  connectionString: string;
  database: string;
  listenPort?: number;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MongoDb;
  cfg.connectionString = config.connectionString;
  cfg.database = config.database;
  cfg.listenPort =
    config.listenPort != null ? config.listenPort : 5000;
  return cfg;
}

export const defaultConfig = CreateSQLiteConfiguration({
  listenPort: 6800,
  database: "./node_modules/apimatic/apimatic.db"
})

export const Connect = (config: Configuration = defaultConfig, callback?: { (server): void }) => {
  const server = new ApiServer(config, callback);
  return server;
}

export const jalMariaDB = CreateMySQLConfiguration({
  user: "root",
  password: "",
  host: "localhost",
  listenPort: 6801,
  database: "angsql",
  port: 3307
});

export const jalMySQL = CreateMySQLConfiguration({
  user: "root",
  password: "",
  host: "localhost",
  listenPort: 6802,
  database: "angsql",
  port: 3306
});

export const jalMSSQL = CreateMSSQLConfiguration({
  listenPort: 6803,
  database: "AngSQL",
  user: "sa",
  password: "Jovibo",
  server: "JAL"
});

export const jalMongo = CreateMongoConfiguration({
  connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  database: "AngSQL",
  listenPort: 6804
});

export const jalSQLite = CreateSQLiteConfiguration({
  listenPort: 6805,
  database: "apisqlite.db"
})

export const JALDEVELOPMariaDB = CreateMySQLConfiguration({
  host: "192.168.178.7",
  user: "root",
  database: "angsql",
  password: "",
  port: 3306,
  listenPort: 6808
})

export const JALDEVELOPMySQL = CreateMySQLConfiguration({
  host: "192.168.178.7",
  user: "root",
  database: "angsql",
  password: "",
  port: 3307,
  listenPort: 6809
})

export const JALDEVELOPMSSQL = CreateMSSQLConfiguration({
  listenPort: 688,
  database: "angsql",
  user: "sa",
  password: "Jovibo",
  server: "JALDEVELOP"
});

export const JALDEVELOPMongo = CreateMongoConfiguration({
  connectionString: "mongodb://192.168.178.7:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  database: "AngSQL",
  listenPort: 6809
});

//mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
export const $$ = module.exports;
export const $ = module.exports;
export const ApiMatic = module.exports;



