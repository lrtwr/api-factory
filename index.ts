import { ApiRouting, factory } from "./ApiFactory";

class ApiFactory {
  static lastConfig: factory.Configuration;
  static configurations: any[] = [];
  static servers: any[] = [];
  static lastServer: any;

  static CreateMSSQLConfiguration(config:{server: string,database: string,user: string, password: string, listenPort?: number}) {
    this.lastConfig = new factory.Configuration();
    this.lastConfig.databaseType = factory.enumDatabaseType.MSSQL;
    this.lastConfig.database = config.database;
    this.lastConfig.server = config.server;
    this.lastConfig.user = config.user;
    this.lastConfig.password = config.password;
    this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
    this.configurations.push(this.lastConfig);
  }
  static CreateMySQLConfiguration(config: {user: string,  password: string,  host: string,  listenPort: number,  database: string}) {
    this.lastConfig = new factory.Configuration();
    this.lastConfig.databaseType = factory.enumDatabaseType.MySQL;
    this.lastConfig.database = config.database;
    this.lastConfig.host = config.host;
    this.lastConfig.user = config.user;
    this.lastConfig.password = config.password;
    this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
    this.configurations.push(this.lastConfig);
  }

  static CreateSQLiteConfiguration(config: {
    connectionString: string;
    database: string;
    listenPort?: number;
  }) {
    this.lastConfig = new factory.Configuration();
    this.lastConfig.databaseType = factory.enumDatabaseType.SQLite;
    this.lastConfig.connectionString = config.connectionString;
    this.lastConfig.database = config.database;
    this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
    this.configurations.push(this.lastConfig);
  }

  static CreateMongoConfiguration(config: {
    connectionString: string;
    database: string;
    listenPort?: number;
  }) {
    this.lastConfig = new factory.Configuration();
    this.lastConfig.databaseType = factory.enumDatabaseType.MongoDb;
    this.lastConfig.connectionString = config.connectionString;
    this.lastConfig.database = config.database;
    this.lastConfig.listenPort = config.listenPort != null ? config.listenPort : 5000;
    this.configurations.push(this.lastConfig);
  }
  static CreateConfiguration() {}
  static Connect(callback?: { (server): void }) {
    this.lastServer = new ApiRouting(this.lastConfig, callback);
    this.servers.push(this.lastServer);
  }
}

const mysqlConfig: factory.Configuration = {
  databaseType: factory.enumDatabaseType.MySQL,
  user: "root",
  password: "Jovibo",
  host: "localhost",
  listenPort: 6000,
  database: "angsql"
};

const sqliteFileConfig: factory.Configuration = {
  databaseType: factory.enumDatabaseType.SQLite,
  connectionString: "Data Source=apisqlite.db;",
  listenPort: 7000,
  database: "apisqlite.db"
};

const sqliteMemoryConfig: factory.Configuration = {
  databaseType: factory.enumDatabaseType.SQLiteMemory,
  connectionString: "Data Source=apisqlite.db;Version=3;",
  listenPort: 5000,
  database: "apisqlite.db"
};

const mssqlConfig: factory.Configuration = {
  databaseType: factory.enumDatabaseType.MSSQL,
  listenPort: 8000,
  database: "AngSQL",
  user: "sa",
  password: "Jovibo",
  server: "JAL"
};

const api = ApiFactory;

api.CreateSQLiteConfiguration({
  connectionString:"Data Source=apisqlite.db;",
  listenPort: 7000,
  database: "apisqlite.db"
})

// api.CreateMySQLConfiguration({user: "root",
// password: "Jovibo",
// host: "localhost",
// listenPort: 6000,
// database: "angsql"})

api.Connect();
