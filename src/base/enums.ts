export enum enumApiActions {
  Create,
  Read,
  Update,
  Delete,
  Count,
  System,
  Error
}

export enum enumOperationMode{
  Default = "Configuration Mode",
  ReadOnly = "Readonly apis for ever table.",
  ReadWrite = "Read and write apis for every table.",
  Admin = "Admin mode. Read, write and create tables."
}

export enum enumDatabaseType {
  MongoDb = "Mongo database",
  CosmosDb = "Cosmos DB",
  SQLite = "SQLite 3",
  SQLiteMemory = "SQLite 3 in Memory",
  MySQL = "MySQL server",
  MariaDB = "Maria DB server",
  MSSQL = "Microsoft SQL server"
}

export enum enumRunningStatus {
  Down = "Down",
  Initializing = "Initializing",
  ApiServerInitializing = "ApiServer is initializing",
  DbConnectInitializing = "Database connection is initializing",
  DbConnectConnected = "Database is Connected",
  ApiServerUp = "ApiServer is Up",
  ApiServerError = "ApiServer Error",
  DbConnectError = "Database connection Error",
  UpAndConnected = "Up and Running"
}

