import { DynamicObject, DaoResult } from './../base/factory';
import { ApiServer } from '../imp/ApiServer';
import { MongoClient, ObjectID } from "mongodb";
import { AbstractDaoSupport } from '../base/abstracts';
import { RunningStatus } from '../base/factory';
import { enumRunningStatus } from '../base/enums';

export class DaoMongoDB extends AbstractDaoSupport {
  mongoCollectionNames: string[] = [];
  mongoViewNames: string[] = [];
  constructor(
    private server: ApiServer,
    private config: any,
    private status: RunningStatus,
    private callback?: { (server): void }
  ) {
    super();
    status.DbConnect = enumRunningStatus.DbConnectInitializing;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    MongoClient.connect(
      self.config.connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          self.status.DbConnect = enumRunningStatus.DbConnectError;
          console.log(error);
        }
        self.db = client.db(self.config.database);
        self.status.DbConnect = enumRunningStatus.DbConnectConnected;
        console.log("Connected to MongoDb: `" + self.config.database + "`!");
        self.db.listCollections().toArray((error, colInfo) => {
          if (error) self.server.lastErrors.push(error);
          colInfo.forEach(column => {
            if (column.type == "collection") {
              self.mongoCollectionNames.push(column.name);
            }
            if (column.type == "view") {
              self.mongoViewNames.push(column.name);
            }
          });
          self.callback(self.server.routing);
        });
      }
    );
  }

  AsyncGet(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    let projection = {};
    let sort = {};
    let query = {};
    const body = request.body;

    if (body["projection"] != null) projection = body["projection"];
    if (body["query"] != null) query = body["query"];
    if (body["sort"] != null) sort = body["sort"];

    return new Promise((resolve, reject) => {
      collection
        .find(query, { projection: projection })
        .sort(sort)
        .toArray((error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (result) {
            answer.rows=result;
            answer.count = result.length;
          }
          resolve(answer);
        });
    });
  }

  AsyncGetId(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      collection.findOne(
        { _id: new ObjectID(request.params.id) },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (result != null) {
            answer.rows=result;
          }
          else{
            answer.unUsedIds.push(request.params.id);
          }
           resolve(answer);
        }
      );
    });
  }

  AsyncExistId(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    return new Promise((resolve, reject) => {
      collection.findOne(
        { _id: new ObjectID(request.params.id) },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (result) answer.count=1;
          resolve(answer);
        }
      );
    });
  }


  AsyncPatchId(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    let body: any;
    if (request.body.insert != null) body = request.body.insert;
    if (request.body.update != null) body = request.body.update;
    let id = request.params.id;
    return this.AsyncUpsertOne(answer, collectionName, body, id)
   }

  AsyncPatch(collectionName, request){
    return this.AsyncPut(collectionName,request,true);
  }

  AsyncPut(collectionName, request, updateOnly:boolean=false) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    let postBody: any;
    if (request.body.insert != null) postBody = request.body.insert;
    if (request.body.update != null) postBody = request.body.update;
    const promises: Promise<any>[] = [];

    if (postBody instanceof Array) {
      postBody.forEach(postItem => {
        if (postItem.hasOwnProperty("_id")) {
          var body: DynamicObject = {};
          var id: any;
          Object.keys(postItem).forEach(key => {
            if (key == "_id") id = postItem["_id"];
            else body[key] = postItem[key];
          })
          promises.push(this.AsyncUpsertOne(answer, collectionName, body, id));
        }
        else{
          if(!updateOnly)promises.push(this.AsyncUpsertOne(answer, collectionName, postItem))
        }
      })
      return Promise.all(promises);
    }
    else {
      var body: DynamicObject = {};
      var id: any = request.params.id;
      Object.keys(postBody).forEach(key => {
        if (key == "_id") id = postBody["_id"];
        else body[key] = postBody[key];
      })
      return this.AsyncUpsertOne(answer, collectionName, id, body);
    }
  }


  //Update or insert a document
  //no id means insert
  //id = "0" means do nothing
  AsyncUpsertOne(answer: DaoResult, collectionName, body: DynamicObject, id?): Promise<any> {
    const collection = this.db.collection(collectionName);
    switch(id){
      case null:
        return new Promise((resolve, reject) => {
          collection.insertOne(
             body , (error, result) => {
              if (error) reject(error);
              if (result) {
                answer.createdIds.push(result.insertedId)
                answer.created++;
              }
              resolve( answer );
            }
          )
        })
        break;
        case "0":
        break;
        default:
          return new Promise((resolve, reject) => {
            collection.updateOne(
              { _id: new ObjectID(id) },
              { $set: body }, (error, result) => {
                if (error) reject(error);
                if (result.matchedCount) {
                  answer.updatedIds.push(id);
                  answer.updated++;
                }
                else {
                  answer.unUsedBodies.push(body);
                  answer.unUsedIds.push(id);
                }
                resolve(answer);
              }
            )
          })
          break;
    }
  }

  AsyncPost(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    let postBody: any;
    if (request.body.insert != null) postBody = request.body.insert;
    if (request.body.update != null) postBody = request.body.update;
    if (postBody instanceof Array) return new Promise((resolve, reject) => {
      collection.insertMany(postBody, (error, result) => {
        if (error) reject(error);
        Object.keys(result.insertedIds).forEach((key) => {
          answer.createdIds.push(result.insertedIds[key]);
        })
        resolve(answer);
      });
    });
    else return new Promise((resolve, reject) => {
      collection.insertOne(postBody, (error, result) => {
        if (error) reject(error);
        if(result)answer.createdIds.push(result.insertedId);
        resolve(answer);
      });
    });
  }

  AsyncPutId(collectionName, request) { return this.AsyncPatchId(collectionName, request) }

  AsyncCount(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    let query = {};
    if (request.body["query"] != null) query = request.body["query"];

    return new Promise((resolve, reject) => {
      collection.find(query).count((error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        if(result) answer.count = result;
        resolve(answer);
      });
    });
  }

  AsyncDeleteId(collectionName, request) {
    const collection = this.db.collection(collectionName);
    const answer = new DaoResult(request);
    const filter = { _id: new ObjectID(request.params.id) };
    return new Promise((resolve, reject) => {
      collection.deleteOne(filter, (error, result) => {
        if (error) reject(error);
        answer.deletedIds.push(request.params.id);
        answer.count = result.deletedCount;
        resolve(answer);
      });
    });
  }

  GetTableNames = (): string[] => {
    return this.mongoCollectionNames;
  };

  GetViewNames = (): string[] => {
    return this.mongoViewNames;
  };
}
