import { ApiServer } from './imp/ApiServer';
import { enumDatabaseType, enumOperationMode } from './base/enums';
import { Configuration, CloneObjectInfo } from './base/custom';
import { AbstractApiRouting } from './imp/ApiRouting';

export const createMSSQLConfiguration = (config: {
  server: string;
  database: string;
  user: string;
  password: string;
  listenPort?: number;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MSSQL;
  CloneObjectInfo(config, cfg);
  return cfg;
}

export const createMySQLConfiguration = (config: {
  host: string;
  database: string;
  user: string;
  port?: number;
  password?: string;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MySQL;
  CloneObjectInfo(config, cfg);
  return cfg;
}

export function createSQLiteInMemoryConfiguration() {
  const cfg = new Configuration();
  cfg.databaseType=enumDatabaseType.SQLiteMemory;
  cfg.database=":memory:";
  return cfg;
}

export const createSQLiteConfiguration = (config: {
  database: string;
}) => {
  const cfg = new Configuration();
  cfg.databaseType=enumDatabaseType.SQLite;
  CloneObjectInfo(config, cfg);
  return cfg;
}

export const createCosmosConfiguration = (config: {
  host: string,
  authKey: string,
  databaseId: string,
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.CosmosDb;
  CloneObjectInfo(config, cfg);
  return cfg;
}

export const createMongoConfiguration = (config: {
  connectionString: string;
  database: string;
}) => {
  const cfg = new Configuration();
  cfg.databaseType = enumDatabaseType.MongoDb;
  CloneObjectInfo(config, cfg);
  return cfg;
}

export const defaultConfig = createSQLiteConfiguration({
  database: "./apimatic.db"
  //database: "./node_modules/apimatic/apimatic.db"
})

export const connect = (config: Configuration = defaultConfig, listenPort:number, callback?: { (error: Error, routing:AbstractApiRouting): void }, multiProcessing:boolean=false) => {
  config.operationMode = enumOperationMode.Default;
  const server = new ApiServer(config, listenPort, callback);
  return server;
}

export const connectReadonly = (config: Configuration = defaultConfig, listenPort:number, multiProcessing:boolean=false) => {
  const callback = ()=>{};
  config.operationMode = enumOperationMode.ReadOnly;
  const server = new ApiServer(config, listenPort, callback, multiProcessing);
  return server;
}

export const connectReadWrite = (config: Configuration = defaultConfig, listenPort:number, multiProcessing:boolean=false) => {
  const callback = ()=>{};
  config.operationMode = enumOperationMode.ReadWrite;
  const server = new ApiServer(config, listenPort, callback, multiProcessing);
  return server;
}

export const connectAdmin = (config: Configuration = defaultConfig, listenPort:number, multiProcessing:boolean=false) => {
  const callback = ()=>{};
  config.operationMode = enumOperationMode.Admin;
  const server = new ApiServer(config, listenPort, callback, multiProcessing);
  return server;
}

export const connectSQLiteMemory = (listenPort:number, multiProcessing:boolean=false) => {
connectAdmin(createSQLiteInMemoryConfiguration(),listenPort, multiProcessing);
}

export const SQLiteMemory = createSQLiteInMemoryConfiguration();

export const jalMariaDB = createMySQLConfiguration({
  user: "root",
  password: "",
  host: "localhost",
  database: "angsql",
  port: 3307
});

export const jalMySQL = createMySQLConfiguration({
  user: "root",
  password: "",
  host: "localhost",
  database: "angsql",
  port: 3306
});

export const jalMSSQL = createMSSQLConfiguration({
  database: "AngSQL",
  user: "sa",
  password: "Jovibo",
  server: "JAL"
});

export const jalMongo = createMongoConfiguration({
  connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  database: "AngSQL"
});

export const jalSQLite = createSQLiteConfiguration({
  database: "apisqlite.db"
});

export const JALDEVELOPMySQL = createMySQLConfiguration({
  host: "192.168.178.7",
  user: "root",
  database: "angsql",
  password: "",
  port: 3306
})

export const JALDEVELOPMariaDB = createMySQLConfiguration({
  host: "192.168.178.7",
  user: "root",
  database: "angsql",
  password: "",
  port: 3307
})

export const JALDEVELOPMSSQL = createMSSQLConfiguration({
  database: "angsql",
  user: "sa",
  password: "Jovibo",
  server: "192.168.178.7"
});

export const JALDEVELOPMongo = createMongoConfiguration({
  connectionString: "mongodb://192.168.178.7:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  database: "AngSQL"
});

export const jalCosmos = createCosmosConfiguration({
  host: "https://localhost:8081/",
  authKey: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
  databaseId: "AngSQL"
});

// werkt nog niet
export const jalMongoCosmos = createMongoConfiguration({
  connectionString: "mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true",
  database: "ToDoList"
});






