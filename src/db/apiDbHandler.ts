import { ApiServer } from './../imp/ApiServer';
import { Configuration, DynamicObject } from './../base/custom';
import { RunningStatus, JsonResult } from "../base/custom";
import { AbstractDao, IDaoBasic } from "./AbstractDao";
import { RequestInfo } from "../base/requestInfo";
import { enumDatabaseType } from '../base/enums';

export class ApiDbHandler {
  public db: any
  public config: Configuration;
  public status: RunningStatus;
  constructor(
    public dao: IDaoBasic&AbstractDao,
    public server: ApiServer,
  ) {
    this.config = server.config;
    this.status = server.status;
    this.dao.connect();
  }

  asyncPost(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    let identityColumn = this.dao.primaryKeyColumnName(requestInfo);
        const answer = new JsonResult(requestInfo);
    let postBody = requestInfo.updateBody;
    var self = this;
    if (!postBody) return Promise.reject("No body found in the request.affix");
    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
      postBody.forEach(postItem => promises.push(self.asyncPostOne(requestInfo, postItem, identityColumn, answer)));
      return Promise.all(promises);
    }
    else return this.asyncPostOne(requestInfo, postBody, identityColumn, answer);
  }
  
  asyncPut = (requestInfo: RequestInfo): Promise<any> => { 
    if(!requestInfo.updateBody)return Promise.resolve(new JsonResult(requestInfo, "This put call has no body. Please add {'Content-Type': 'application/json'} to the header."));
    return this.asyncPost(requestInfo);
  }

  asyncPostOne(requestInfo: RequestInfo, body:{[k:string]:any}, identityColumn:string, answer: JsonResult): Promise<any> {
    const self = this;
    if (!body.hasOwnProperty(identityColumn) ) {
      return new Promise((resolve, reject) => {
        self.dao.addItem(requestInfo, body, (error: Error, result:any) => {
          if (error) reject(error);
          if (result) {
            answer.createdIds.push(result);
            answer.created++;
            answer.count++;
            if (answer.count == 1) answer.message = `One record is added or updated in table '${requestInfo.tableName}'.`;
            else answer.message = `${answer.count} records are added or updated in table '${requestInfo.tableName}'.`;
            resolve(answer);
          }
        });
      })
    } else {
      answer.unUsedBodies.push(body);
      answer.message += "Identitycolumn " + identityColumn + " information given. Record not created. Remove identityColum in the post.";
      answer.unUsedIds.push(body[identityColumn]);
      return Promise.resolve(answer);
    }
  }

  asyncPatchOne(requestInfo: RequestInfo, id: any, body:{[k:string]:any}, identityColumn:string, answer:JsonResult): Promise<any> {
    const self = this;
    if (!body.hasOwnProperty(identityColumn)) {
      return new Promise((resolve, reject) => {
        self.dao.updateItem(requestInfo, id, body, (error:Error,result:any) => {
          if (error) reject(error);
          if (result) {
            answer.updatedIds.push(requestInfo.id??body[identityColumn]);
            answer.updated++;
            answer.count++
            if (answer.count == 1) answer.message = `One record is added or updated in table '${requestInfo.tableName}'.`;
            else answer.message = `${answer.count} records are added or updated in table '${requestInfo.tableName}'.`;
            answer.message += `Table '${requestInfo.tableName}' is updated.`;
            resolve(answer);
          }
        });
      })
    } else {
      answer.unUsedBodies.push(body);
      answer.message += "No information in identitycolumn " + identityColumn + ".";
      answer.unUsedIds.push(null);
      return Promise.resolve(answer);
    }
  }

  asyncPatchAll(requestInfo: RequestInfo, body: DynamicObject, answer:JsonResult): Promise<any> {
    var self=this;
    return new Promise((resolve, reject) => {
      self.dao.updateAll(requestInfo, body, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.updatedIds=result;
          answer.updated=answer.updatedIds.length;
          answer.count=answer.updatedIds.length
          answer.message = `Records(${answer.count}) updated in table '${requestInfo.tableName}'.`;
          resolve(answer);
        }
      })
    })
  }

  asyncPatch(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const columnProperties = this.dao.columnProperties(requestInfo);
    const identityColumn = this.dao.primaryKeyColumnName(requestInfo);
    const answer = new JsonResult(requestInfo);
    let postBody: {[k:string]:any} = requestInfo.updateBody;
    var self = this;
    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
              //Jeroen: wat doen met postBodies zonder pk id => niet gebruiken?
      postBody.forEach(postItem => promises.push(self.asyncPatchOne(requestInfo, postItem[identityColumn],  postItem, identityColumn, answer)));
      return Promise.all(promises);
    }
    else {
      if(postBody[identityColumn]){
        return this.asyncPatchOne(requestInfo, postBody[identityColumn] , postBody, identityColumn, answer);
      }
      else return this.asyncPatchAll(requestInfo,postBody, answer)
    }
  }

  asyncPutOne(requestInfo: RequestInfo, body:any, identityColumn:string, answer: JsonResult): Promise<any> {
    const self = this;
    if (!body.hasOwnProperty(identityColumn)) {
      return new Promise((resolve, reject) => {
        self.dao.updateItem(requestInfo, body[identityColumn], body, (error:Error,result:any) => {
          if (error) reject(error);
          if (result) {
            answer.updatedIds.push(body[identityColumn]);
            answer.updated++;
            answer.count++
            resolve(answer);
          }
        });
      })
    } else {
      return new Promise((resolve, reject) => {
        self.dao.addItem(requestInfo, body, (error:Error,result:any) => {
          if (error) reject(error);
          if (result) {
            answer.createdIds.push(result);
            answer.created++;
            answer.count++;
            resolve(result);
          }
        });
      })
    }
  }

  asyncPatchId(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const identityColumn = this.dao.primaryKeyColumnName(requestInfo);
    const answer = new JsonResult(requestInfo);

    return this.asyncPatchOne(requestInfo,requestInfo.id, requestInfo.updateBody, identityColumn, answer);
  }

  asyncExistId(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.itemExists(requestInfo, requestInfo.id, (error:Error,result:any) => {
        if (error) reject(error);
        answer.count = result
        resolve(answer);
      })
    });
  }

  asyncPutId(requestInfo: RequestInfo): Promise<any> {
    return this.asyncPatchId(requestInfo);
  }

  // Dao calls

  // Get all documents/rows as json Response 
  // @param collectionID is the name/id of the container / collection
  // @param request is the request information send by the client
  asyncGet(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.getAllItems(requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.rows = result;
          answer.count = result.length;
          answer.message = `${answer.count} records received.`;
          resolve(answer);
        }
      })
    });
  }

  // Get one json item Response with an id from request.params.id
  // @param collectionID is the name/id of the container / collection
  // @param request is the request information send by the client
  asyncGetId(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.getItem(requestInfo, requestInfo.id, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.rows = result;
          answer.count = answer.rows.length;
          answer.message = `${answer.count} record received.`;
        }
        else answer.unUsedIds.push(requestInfo.id);
        resolve(answer);
      })
    });
  }

  // Count table rows or documents 
  // @param collectionID is the name/id of the container / collection
  // @param request is the request information send by the client
  asyncCount(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.countItems( requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) answer.count = result;
        answer.count = 0;
        answer.message = `${answer.count} records counted.`;
        resolve(answer);
      });
    });
  }

  // Delete one json Response with an id from request.params.id
  // @param collectionID is the name/id of the container / collection
  // @param request is the request information send by the client
  asyncDeleteId(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.deleteItem(requestInfo, requestInfo.id, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.deletedIds.push(result);
          answer.deleted++
          answer.message = `${answer.deleted} records deleted.`;
          resolve(answer);
        }
      })
    });
  }

  asyncCreateTable(requestInfo: RequestInfo): Promise<any> {
    if (this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Table " + (requestInfo.tableName) + " already exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.createTable(requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.message = result;
          answer.message = `'${this.config.isSql ? "Table" : "Collection"}' '${requestInfo.originalUnitId}' created.`;
          resolve(answer);
        }
      })
    });
  }

  asyncDeleteTable(requestInfo: RequestInfo): Promise<any> {
    if (!this.dao.tableExists(requestInfo)) return Promise.resolve(new JsonResult(requestInfo, "Cannot delete table " + (requestInfo.tableName) + ". Table does not exist."))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.deleteTable(requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.message = result;
          answer.message = `'${this.config.isSql ? "Table" : "Collection"}' '${requestInfo.tableName}' deleted.`;
          resolve(answer);
        }
        else{
          answer.message = `'${this.config.isSql ? "Table" : "Collection"}' '${requestInfo.tableName}' is not deleted.`;
          resolve(answer);
        }
      })
    });
  }

  asyncCreateColumn(requestInfo: RequestInfo): Promise<any> {
    if (!this.config.isSql) return Promise.resolve(new JsonResult(requestInfo, "Due to the nature of " + this.config.databaseType + ", this action is not needed!"))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.createColumn(requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.message = result;
          answer.message = `Column '${requestInfo.columnName}' of datatype '${requestInfo.dataType}' created in table '${requestInfo.tableName}'.`;
          resolve(answer);
        }
      })
    });
  }

  asyncCreateForeignKey(requestInfo: RequestInfo): Promise<any> {
    if (!this.config.isSql) return Promise.resolve(new JsonResult(requestInfo, "Due to the nature of " + this.config.databaseType + ", this action is not needed!"))
    const answer = new JsonResult(requestInfo);
    return new Promise((resolve, reject) => {
      this.dao.createForeignKey(requestInfo, (error:Error,result:any) => {
        if (error) reject(error);
        if (result) {
          answer.message = result;
          answer.message = `Foreign key '${requestInfo.targetTable}ID' of datatype '${requestInfo.dataType}' created in table '${requestInfo.tableName}'.`;
          resolve(answer);
        }
      })
    });
  }

  asyncPromiseMessage(requestInfo: RequestInfo, message: string): Promise<any> {
    return Promise.resolve(new JsonResult(requestInfo, message))
  }
}