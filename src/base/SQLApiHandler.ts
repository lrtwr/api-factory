import { AbstractApiHandler, AbstractDaoSupport } from "./abstracts";
import { enumApiActions } from "./enums";
import { ApiJsonResponse } from "./factory";

export class SQLApiHander extends AbstractApiHandler 
{
  jsnRes: ApiJsonResponse;
  constructor(public dao: AbstractDaoSupport) {
    super();
    this.jsnRes = new ApiJsonResponse();
  }

  Error(error: any, request: any, response: any){
    const promise = Promise.resolve(error);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Error);
  }

  Post(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncPost(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Create);
  }

  Get(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncGet(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Read);
  }

  GetId(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncGetId(tableName,request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Read);
  }

  Put(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncPut(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Update);
  }

  PutId(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncPut(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Update);
  }

  PatchId(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncPatchId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Update);
  }

  Patch(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncPatch(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Update);
  }

  DeleteId(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncDeleteId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Delete);
  }

  ExistId(tableName: any, request: any, response: any) {
    const promise = this.dao.AsyncExistId(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Read);
  }

  GetCount(tableName: any, request: any, response: any) {
     const promise = this.dao.AsyncCount(tableName, request);
    this.jsnRes.awaitAndRespond(request, response, promise, enumApiActions.Count);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Test(_tableName: any, _request: any, _response: any) {
    let i: any;
    // eslint-disable-next-line prefer-const
    i = 4;
    console.log(i);
  }
}

