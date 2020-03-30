import { ApiServer } from '../imp/ApiServer';
import { enumApiActions } from "./enums";
import { ApiJsonResponse } from "./custom";
import { ApiDaoFactory } from "../db/ApiDaoFactory";
import { ApiDbHandler } from "../db/apiDbHandler";
import { RequestInfo } from "./requestInfo";
import { IResponseDirector } from './iResponseDirector';


export class ResponseDirector implements IResponseDirector
{
  public apiDb: ApiDbHandler;
  jsnRes: ApiJsonResponse;

  constructor(server: ApiServer) {
    this.jsnRes = new ApiJsonResponse();
    this.apiDb = ApiDaoFactory.GetApiDbHandler(server);
  }

  error(error: any, request: any, response: any){
    const requestInfo = new RequestInfo(request);
    const promise = Promise.resolve(error);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Error);
  }

  post(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncPost(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Create);
  }

  get(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncGet(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Read);
  }

  getId(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncGetId(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Read);
  }

  put(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise: Promise<any> = this.apiDb.asyncPut(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Update);
  }

  putId(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncPutId(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Update);
  }

  patchId(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncPatchId(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Update);
  }

  patch(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncPatch(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Update);
  }

  deleteId(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncDeleteId(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Delete);
  }

  existId(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
    const promise = this.apiDb.asyncExistId(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Read);
  }

  count(tableName: any, request: any, response: any) {
    const requestInfo = new RequestInfo(request, tableName);
     const promise = this.apiDb.asyncCount(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.Count);
  }
  
  public createTable(request: any, response: any) {
    const requestInfo = new RequestInfo(request);
    const promise = this.apiDb.asyncCreateTable(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.System);
  }

  public deleteTable(request: any, response: any) {
    const requestInfo = new RequestInfo(request);
    const promise = this.apiDb.asyncDeleteTable(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.System);
  }

  public createColumn(request: any, response: any) {
    const requestInfo = new RequestInfo(request);
    const promise = this.apiDb.asyncCreateColumn(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.System);
  }

  public createForeignKey( request: any, response: any) {
    const requestInfo = new RequestInfo(request);
    const promise = this.apiDb.asyncCreateForeignKey(requestInfo);
    this.jsnRes.awaitAndRespond(requestInfo, response, promise, enumApiActions.System);
  }
}

