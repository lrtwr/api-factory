import { RequestInfo } from '../base/requestInfo';
import { DynamicObject, Configuration } from '../base/custom';
import { MongoClient } from "mongodb";
import { AbstractDao, IDaoBasic } from './AbstractDao';
import { RunningStatus } from '../base/custom';
import { enumRunningStatus } from '../base/enums';
import { ObjectID } from "mongodb";
import { AbstractApiRouting } from '../imp/ApiRouting';

export class DaoMongo extends AbstractDao implements IDaoBasic {
  public primaryKeyColumnName = (requestInfo: RequestInfo) =>{ return "_id"; }

  createForeignKey(requestInfo: RequestInfo, callback: any) {
    throw new Error("Method not implemented.");
  }
  createTable(requestInfo: RequestInfo, callback: any) {
    var deze = this;
    this.db.createCollection(requestInfo.originalUnitId, (error: Error) => {
      if (error) callback(error);
      else {
        deze.getDbInfo();
        let collection = this.db.collection(requestInfo.originalUnitId);
        callback(null, collection != null)
      }
    })
  }

  deleteTable(requestInfo: RequestInfo, callback: any) {
    var deze = this;
    let collection = this.db.collection(requestInfo.originalUnitId);
    collection.drop(function (error: Error, result: any) {
      if (error) callback(error);
      if (result) {
        deze.getDbInfo();
        callback(null, 1)
      };
    });
  }

  createColumn(requestInfo: RequestInfo, callback: any) {
    throw new Error("Method not implemented.");
  }

  executeSql(sql: string, callback: any) {
    throw new Error("Method not implemented.");
  }

  tableExists = (requestInfo: RequestInfo): boolean =>{
    let ret: boolean = false;
    this.mongoCollectionNames.forEach((col) => {
      if (col == requestInfo.originalUnitId) ret = true;
    })
    return ret;
  }

  mongoCollectionNames: string[] = [];
  mongoViewNames: string[] = [];
  public config: Configuration;
  public status: RunningStatus;

  constructor(
    public server: any,
    public callback?: { (error:Error, routing: AbstractApiRouting): void }
  ) {
    super();
    this.config = server.config;
    this.status = server.status;
  }

  itemExists(unitId: any, itemId: any, callback: any) {
    const collection = this.db.collection(unitId);
    collection.findOne(
      { _id: new ObjectID(itemId) },
      (error: Error, result: any) => {
        if (error) callback(error);
        if (result) callback(1)
        else callback(0);
      });
  }

  async connect() {
    this.status.DbConnect = enumRunningStatus.DbConnectInitializing;
    const self = this;
    MongoClient.connect(
      self.config.connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          self.status.DbConnect = enumRunningStatus.DbConnectError;
          this.server.addError({ error: error, message: "Mongo connection error" })
          console.log(error);
        }
        self.db = client.db(self.config.database);

        this.getDbInfo((error: Error, result: any) => {
          if (error) self.server.addError(error);
          if (result) {
            if (result == "1") {
              self.callback(null,self.server.routing);
              this.status.DbConnect = enumRunningStatus.DbConnectConnected;
              console.log("Connected to MongoDb: `" + this.config.database + "` on process:" +process.pid+".");
            }
          }
        });
      }
    );
  }

  getDbInfo(callback?: any) {
    this.db.listCollections().toArray((error: Error, result: any) => {
      if (error) {
        if (callback) callback(error);
      }
      else {
        this.mongoCollectionNames = [];
        this.mongoViewNames = [];
        result.forEach((column: any) => {
          if (column.type == "collection") {
            this.mongoCollectionNames.push(column.name);
          }
          if (column.type == "view") {
            this.mongoViewNames.push(column.name);
          }
        });
        if (callback) callback(null, 1);
      }
    });
  }

  async getAllItems(requestInfo: RequestInfo, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    collection
      .find(requestInfo.mongoQuery, { projection: requestInfo.mongoProjection })
      .sort(requestInfo.mongoSort)
      .toArray((error: Error, result: any) => {
        if (error) callback(error);
        callback(null, result);
      });
  }

  async getItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    collection.findOne(
      { _id: new ObjectID(itemId) },
      (error: Error, result: any) => {
        if (error) callback(error);
        callback(null, result);
      }
    );
  }

  async countItems(requestInfo: RequestInfo, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    collection.find(requestInfo.mongoQuery).count((error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result);
    });
  }

  async addItem(requestInfo: RequestInfo, body:{[k:string]:any}, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    await collection.insertOne(body, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result.insertedId);
    });
  }

  async updateItem(requestInfo: RequestInfo, id:any, body:{[k:string]:any}, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: body },
      (error:Error, result:any) => {
        if (error) callback(error);
        callback(null, [result.modifiedCount]);
      }
    );
  }

  async updateAll(requestInfo: RequestInfo, body: { [k: string]: any; }, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    collection.updateMany(
      requestInfo.mongoQuery,
      { $set: body },
      (error:Error, result:any) => {
        if (error) callback(error);
        callback(null, [result.modifiedCount]);
      }
    );
  }

  async deleteItem(requestInfo: RequestInfo, itemId: any, callback: any) {
    const collection = this.db.collection(requestInfo.originalUnitId);
    const filter = { _id: new ObjectID(itemId) };
    collection.deleteOne(filter, (error: Error, result: any) => {
      if (error) callback(error);
      if (result) callback(null, result);
    });
  }

  getTableNames = (): string[] => {
    return this.mongoCollectionNames;
  };

  getViewNames = (): string[] => {
    return this.mongoViewNames;
  };

  getPrimaryKeys = (): DynamicObject => {
    const ret: DynamicObject = {};
    const tableNames = this.getTableNames();
    tableNames.forEach(table => {
      ret[table] = "_id";
    });
    return ret;
  }
}