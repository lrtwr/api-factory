import { JsonDatabase, DaoResult, DynamicObject, ColumnDef } from "./factory";
import { ApiSQLStatements } from "./ApiSQLStatements";

export abstract class AbstractApiHandler {
  public dao: any;
  public abstract Post(tableName, request, response): any;
  public abstract Get(tableName, request, response): any;
  public abstract GetId(tableName, request, response): any;
  public abstract Put(tableName, request, response): any;
  public abstract PutId(tableName, request, response): any;
  public abstract Patch(tableName, request, response): any;
  public abstract PatchId(tableName, request, response): any;
  public abstract ExistId(tableName, request, response): any;
  public abstract DeleteId(tableName, request, response): any;
  public abstract GetCount(tableName, request, response): any;
  public abstract Test(tableName, request, response): any;
  public abstract Error(error, request, response): any;
}

export abstract class AbstractDaoSupport {
  public db: any
  public tableProperties: JsonDatabase;
  public abstract AsyncGet(tableNameOrCollection, request): any;
  public abstract AsyncGetId(tableNameOrCollection, request): any;
  public abstract AsyncExistId(tableNameOrCollection, request): any;
  public abstract AsyncPatchId(tableNameOrCollection, request): any;
  public abstract AsyncPutId(tableNameOrCollection, request): any;
  public abstract AsyncDeleteId(tableNameOrCollection, request): any;
  public abstract AsyncCount(tableNameOrCollection, request): any;
  public GetColumnProperties(tableName) {
    return this.tableProperties.db.table_name[tableName];
  }

  public GetModels() {
    const tables: string[] = this.GetTableNames();
    const ret: DynamicObject = {};
    let columns: string[];
    let model: DynamicObject;
      tables.forEach(tableName => {
        model = {};
        this.tableProperties.db.table_name[tableName].forEach((column) => {
            model[column.column_name] = column.data_type;
        });
        ret[tableName] =model;
      });
      return ret;
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

  AsyncPost(tableName, request) {
    const columnProperties = this.GetColumnProperties(tableName);
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    let postBody: any;
    if (request.body.insert != null) postBody = request.body.insert;
    if (request.body.update != null) postBody = request.body.update;

    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
      postBody.forEach(postItem => {
        if (!postItem.hasOwnProperty(identityColumn)) {
          let sql = ApiSQLStatements.GetInsertFromBodyStatement(
            tableName,
            columnProperties,
            postItem
          );
          promises.push(this.AsyncInsert(answer, sql))
        } else {
          answer.unUsedBodies.push(postItem);
          answer.message += "Identitycolumn " + identityColumn + " information found. Record probably already created.";
          answer.unUsedIds.push(postItem[identityColumn]);
          promises.push(Promise.resolve(answer))
        }
      });
      return Promise.all(promises);
    }
    else {
      if (!postBody.hasOwnProperty(identityColumn)) {
        let sql = ApiSQLStatements.GetInsertFromBodyStatement(
          tableName,
          columnProperties,
          postBody
        );
        return this.AsyncInsert(answer, sql);
      } else {
        answer.unUsedBodies.push(postBody);
        answer.message += "Identitycolumn " + identityColumn + " information found. Record probably already created.";
        answer.unUsedIds.push(postBody[identityColumn]);
        promises.push(Promise.resolve(answer))
      }
    }
  }

  AsyncInsert(answer: any, sql: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  AsyncPatch(tableName, request) {
    const columnProperties = this.GetColumnProperties(tableName);
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    let postBody: any;
    if (request.body.insert != null) postBody = request.body.insert;
    if (request.body.update != null) postBody = request.body.update;

    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
      postBody.forEach(postItem => {
        if (postItem.hasOwnProperty(identityColumn)) {
          let sql = ApiSQLStatements.GetUpdateFromBodyStatement(
            tableName,
            identityColumn,
            columnProperties,
            postItem
          );
          promises.push(this.AsyncUpdate(answer, sql, postItem[identityColumn]))
        }
        else {
          answer.unUsedBodies.push(postItem);
          answer.message += "No information in identitycolumn " + identityColumn + ".";
          answer.unUsedIds.push(null);
          promises.push(Promise.resolve(answer))
        }
      });
      return Promise.all(promises);
    }
    else {
      if (postBody.hasOwnProperty(identityColumn)) {
        let sql = ApiSQLStatements.GetUpdateFromBodyStatement(
          tableName,
          identityColumn,
          columnProperties,
          postBody
        );
        return this.AsyncUpdate(answer, sql, postBody[identityColumn]);
      }
      else {
        answer.unUsedBodies.push(postBody);
        answer.message += "No information in identitycolumn " + identityColumn + ".";
        answer.unUsedIds.push(null);
        return Promise.resolve(answer);
      }
    }
  }

  AsyncUpdate(answer: any, sql: string, arg2: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  AsyncPut(tableName, request) {
    const columnProperties = this.GetColumnProperties(tableName);
    const identityColumn = this.GetPrimarayKeyColumnName(tableName);
    const answer = new DaoResult(request);
    let postBody: any;
    let sql: string;
    if (request.body.insert != null) postBody = request.body.insert;
    if (request.body.update != null) postBody = request.body.update;

    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
      postBody.forEach(postItem => {
        if (postItem.hasOwnProperty(identityColumn)) {
          sql = ApiSQLStatements.GetUpdateFromBodyStatement(
            tableName,
            identityColumn,
            columnProperties,
            postItem
          );
          promises.push(this.AsyncUpdate(answer, sql, postItem[identityColumn]))
        }
        else {
          sql = ApiSQLStatements.GetInsertFromBodyStatement(
            tableName,
            columnProperties,
            postItem
          );
          promises.push(this.AsyncInsert(answer, sql))
        }
      });
      return Promise.all(promises);
    }
    else {
      if (postBody.hasOwnProperty(identityColumn)) {
        sql = ApiSQLStatements.GetUpdateFromBodyStatement(
          tableName,
          identityColumn,
          columnProperties,
          postBody
        );
        return this.AsyncUpdate(answer, sql, postBody[identityColumn]);
      }
      else {
        let sql = ApiSQLStatements.GetInsertFromBodyStatement(
          tableName,
          columnProperties,
          postBody
        );
        return this.AsyncInsert(answer, sql);
      }
    }
  }
}

