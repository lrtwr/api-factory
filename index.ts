import { ApiRouting, factory } from "./ApiFactory";

export module ApiFactory {

  export const CreateMSSQLConfiguration=(config: {
   server: string;
   database: string;
   user: string;
   password: string;
   listenPort?: number;
 }) => {
   const cfg = new factory.Configuration();
   cfg.databaseType = factory.enums.enumDatabaseType.MSSQL;
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
   const cfg  = new factory.Configuration();
   cfg.databaseType = factory.enums.enumDatabaseType.MySQL;
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
   connectionString: string;
   database: string;
   listenPort?: number;
 }) => {
   const cfg = new factory.Configuration();
   cfg.databaseType = factory.enums.enumDatabaseType.SQLite;
   cfg.connectionString = config.connectionString;
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
   const cfg = new factory.Configuration();
   cfg.databaseType = factory.enums.enumDatabaseType.MongoDb;
   cfg.connectionString = config.connectionString;
   cfg.database = config.database;
   cfg.listenPort =
     config.listenPort != null ? config.listenPort : 5000;
     return cfg;
 }

 export const Connect = (config: factory.Configuration, callback?: { (server): void }) => {
   const server = new ApiRouting(config, callback);
   return server;
 }
}

const mysqlConfig: factory.Configuration = {
  databaseType: factory.enums.enumDatabaseType.MySQL,
  user: "root",
  password: "Jovibo",
  host: "localhost",
  listenPort: 6000,
  database: "angsql"
};

const sqliteFileConfig: factory.Configuration = {
  databaseType: factory.enums.enumDatabaseType.SQLite,
  connectionString: "Data Source=apisqlite.db;",
  listenPort: 7000,
  database: "apisqlite.db"
};

const sqliteMemoryConfig: factory.Configuration = {
  databaseType: factory.enums.enumDatabaseType.SQLiteMemory,
  connectionString: "Data Source=apisqlite.db;Version=3;",
  listenPort: 5000,
  database: "apisqlite.db"
};

const mssqlConfig: factory.Configuration = {
  databaseType: factory.enums.enumDatabaseType.MSSQL,
  listenPort: 8000,
  database: "AngSQL",
  user: "sa",
  password: "Jovibo",
  server: "JAL"
};

export const Connect = (config: factory.Configuration, callback?: { (server): void }) => {
  const server = new ApiRouting(config, callback);
  return server;
}
const api = ApiFactory;

// api.CreateSQLiteConfiguration({
//   connectionString:"Data Source=apisqlite.db;",
//   listenPort: 7004,
//   database: "apisqlite.db"
// })

// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql",
// port: 3306});

// api.CreateMSSQLConfiguration({
//   listenPort:8000,
//   database: "AngSQL",
//   user:"sa",
//   password: "Jovibo",
//   server: "JAL"
// })


// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Ma#14Jovibo",
//   host: "127.0.0.1",
//   listenPort: 9000,
//   database: "angsql",
//   port: 3307
// });

// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Jovibo",
//   host: "127.0.0.1",
//   listenPort: 11000,
//   database: "angsql",
//   port: 3306
// });

// api.CreateMongoConfiguration({
//   connectionString:"mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-1m6kn.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",
//   database: "AngSQL",
//   listenPort: 6001
// })

// api.CreateMongoConfiguration({
//   connectionString:"mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-w2idf.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true",
//   database: "AngSQL",
//   listenPort: 6002
// })

// api.CreateMongoConfiguration({
//   connectionString:"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
//   database: "AngSQL",
//   listenPort: 6003
// })

const configSQLite = api.CreateSQLiteConfiguration({
  connectionString:"Data Source=apisqlite.db;",
  listenPort: 6802,
  database: "apisqlite.db"
})



const configMySQL = api.CreateMySQLConfiguration({
  user: "root",
  password: "Ma#14Jovibo",
  host: "localhost",
  listenPort: 6800,
  database: "angsql",
  port: 3307
});

const configMSSQL = api.CreateMSSQLConfiguration({
  listenPort:6801,
  database: "AngSQL",
  user:"sa",
  password: "Jovibo",
  server: "JAL"
})

//api.Connect(configMySQL);
//api.Connect(configMSSQL);
api.Connect(configSQLite);