import { ApiServer } from './imp/ApiServer';
import { enumDatabaseType } from './base/enums';
import { Configuration } from './base/factory';
export { ApiRouting } from "./imp/ApiRouting";
export { ApiFactoryHandler } from "./db/daoSupport";

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
    connectionString: string;
    database: string;
    listenPort?: number;
  }) => {
    const cfg = new Configuration();
    cfg.databaseType = enumDatabaseType.SQLite;
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
    const cfg = new Configuration();
    cfg.databaseType = enumDatabaseType.MongoDb;
    cfg.connectionString = config.connectionString;
    cfg.database = config.database;
    cfg.listenPort =
      config.listenPort != null ? config.listenPort : 5000;
    return cfg;
  }

  export const Connect = (config: Configuration, callback?: { (server): void }) => {
    const server = new ApiServer(config, callback);
    return server;
  }



// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql",
// port: 3306});

// api.CreateMySQLConfiguration({
//   user: "root",
//   password: "Ma#14Jovibo",
//   host: "127.0.0.1",
//   listenPort: 9000,
//   database: "angsql",
//   port: 3307
// });

export const defaultSQLite = CreateSQLiteConfiguration({
  connectionString: `Data Source=apisqlite.db;`,
  listenPort: 6802,
  database: "apisqlite.db"
})

export const defaultMariaDB = CreateMySQLConfiguration({
  user: "root",
  password: "Ma#14Jovibo",
  host: "localhost",
  listenPort: 6800,
  database: "angsql",
  port: 3307
});

export const defaultMSSQL = CreateMSSQLConfiguration({
  listenPort: 6801,
  database: "AngSQL",
  user: "sa",
  password: "Jovibo",
  server: "JAL"
})

export const defaultMongoExtern1 = CreateMongoConfiguration({
  connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-1m6kn.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",
  database: "AngSQL",
  listenPort: 6803
})

export const defaultMongoExtern2 = CreateMongoConfiguration({
  connectionString: "mongodb+srv://JeroenLeertouwer:Mo%2328Jovibo@cluster0-w2idf.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true",
  database: "AngSQL",
  listenPort: 6804
})

export const defaultMongoLocal = CreateMongoConfiguration({
  connectionString: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  database: "AngSQL",
  listenPort: 6805
})

