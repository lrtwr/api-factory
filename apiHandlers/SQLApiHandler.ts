import { factory } from "../setup/factory";
import { ApiSQLStatements } from "../setup/ApiSQLStatements";


export class SQLApiHander extends factory.AbstractApiHandler {
  constructor(public dao: factory.AbstractDaoSupport) {
    super();
  }

  Error(error, request, response){
    const promise = Promise.resolve(error);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Error);
  }

  async Post(tableName, request, response) {
    const promise = this.dao.AsyncPost(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Create);
  }

  Get(tableName, request, response) {
    const promise = this.dao.AsyncGet(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Read);
  }

  GetId(tableName, request, response) {
    const promise = this.dao.AsyncGetId(tableName,request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Read);
  }

  Put(tableName, request, response) {
    this.Post(tableName, request, response);
  }

  PutId(tableName, request, response) {
    this.PatchId(tableName, request, response);
  }

  async PatchId(tableName, request, response) {
    const promise = this.dao.AsyncPatchId(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Update);
  }

  DeleteId(tableName, request, response) {
    const promise = this.dao.AsyncDeleteId(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Delete);
  }

  ExistId(tableName, request, response) {
    const promise = this.dao.AsyncExistId(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Delete);
  }

  GetCount(tableName, request, response) {
     const promise = this.dao.AsyncCount(tableName, request);
    this.awaitAndRespond(request, response, promise, factory.enumApiActions.Count);
  }

  Test(tableName, request, response) {}
}
