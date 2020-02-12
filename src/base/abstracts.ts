import { JsonDatabase } from "./factory";

export abstract class AbstractApiHandler {
  public dao: any;
  public abstract Post(tableName, request, response): any;
  public abstract Get(tableName, request, response): any;
  public abstract GetId(tableName, request, response): any;
  public abstract Put(tableName, request, response): any;
  public abstract PutId(tableName, request, response): any;
  public abstract PatchId(tableName, request, response): any;
  public abstract ExistId(tableName, request, response): any;
  public abstract DeleteId(tableName, request, response): any;
  public abstract GetCount(tableName, request, response): any;
  public abstract Test(tableName, request, response): any;
  public abstract Error(error, request, response): any;
}

export abstract class AbstractDaoSupport {
  public db: any;
  public tableProperties: JsonDatabase;
  public abstract AsyncPost(tableNameOrCollection, request): any;
  public abstract AsyncGet(tableNameOrCollection, request): any;
  public abstract AsyncGetId(tableNameOrCollection, request): any;
  public abstract AsyncExistId(tableNameOrCollection, request): any;
  public abstract AsyncPatchId(tableNameOrCollection, request): any;
  public abstract AsyncDeleteId(tableNameOrCollection, request): any;
  public abstract AsyncCount(tableNameOrCollection, request): any;
  public GetColumnProperties(tableName) {
    return this.tableProperties.db.table_name[tableName];
  }

  public GetPrimarayKeyColumnName(tableName) {
    let ret: string;
    this.tableProperties.db.table_name[tableName].forEach(column => {
      if (column.column_is_pk) {
        ret = column.column_name;
      }
    });
    return ret;
  }

  public GetTableNames = () => {
    if (!this.tableProperties.db.table_type) return [];
    else if (!this.tableProperties.db.table_type.table) return [];
    return this.tableProperties.GetPropArray(
      this.tableProperties.db.table_type.table,
      "table_name"
    );
  };

  public GetViewNames = () => {
    if (!this.tableProperties.db.table_type) return [];
    else if (!this.tableProperties.db.table_type.view) return [];
    return this.tableProperties.GetPropArray(
      this.tableProperties.db.table_type.view,
      "table_name"
    );
  };
}

