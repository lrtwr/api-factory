export enum enumApiActions {
  Create,
  Read,
  Update,
  Delete,
  Count,
  Error
}

export enum enumDatabaseType {
  MongoDb = "Mongo database",
  SQLite = "SQLite 3",
  SQLiteMemory = "SQLite 3 in Memory",
  MySQL = "MySQL server",
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

