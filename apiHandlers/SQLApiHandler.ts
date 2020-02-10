import { factory } from "../setup/factory";
import { ApiSQLStatements } from "../setup/ApiSQLStatements";


export class SQLApiHander extends factory.abstracts.AbstractApiHandler 
{
  jsnRes: factory.ApiJsonResponse;
  constructor(public dao: factory.abstracts.AbstractDaoSupport) {
    super();
    this.jsnRes = new factory.ApiJsonResponse();
  }

  Error(error, request, response){
    const promise = Promise.resolve(error);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Error);
  }

  async Post(tableName, request, response) {
    const promise = this.dao.AsyncPost(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Create);
  }

  Get(tableName, request, response) {
    const promise = this.dao.AsyncGet(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Read);
  }

  GetId(tableName, request, response) {
    const promise = this.dao.AsyncGetId(tableName,request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Read);
  }

  Put(tableName, request, response) {
    this.Post(tableName, request, response);
  }

  PutId(tableName, request, response) {
    this.PatchId(tableName, request, response);
  }

  async PatchId(tableName, request, response) {
    const promise = this.dao.AsyncPatchId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Update);
  }

  DeleteId(tableName, request, response) {
    const promise = this.dao.AsyncDeleteId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Delete);
  }

  ExistId(tableName, request, response) {
    const promise = this.dao.AsyncExistId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Delete);
  }

  GetCount(tableName, request, response) {
     const promise = this.dao.AsyncCount(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, factory.enums.enumApiActions.Count);
  }

  Test(tableName, request, response) {}
}

