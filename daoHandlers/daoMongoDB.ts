import { factory } from "../setup/factory";
import { MongoClient, ObjectID } from "mongodb";

export class daoMongoDB extends factory.AbstractDaoSupport {
  public database: any;
  constructor(
    private server: any,
    private config: any,
    private status: factory.RunningStatus,
    private callback?: { (server): void }
  ) {
    super(status);
    this.AsyncConnect();
  }

  public async dbConnect(deze: any) {
    MongoClient.connect(
      deze.config.connectionString,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          deze.status.DbConnect = factory.enumRunningStatus.DbConnectError;
          console.log(error);
        }
        deze.database = client.db(deze.config.database);
        deze.status.DbConnect = factory.enumRunningStatus.DbConnectConnected;
        deze.database = client.db(deze.config.database);
        console.log("Connected to MongoDb: `" + deze.config.database + "`!");
        deze.callback(deze.server);
      }
    );
  }
  public async AsyncConnect() {
    await this.dbConnect(this);
  }

  AsyncGet(collectionName, request) {
    var collection = this.database.collection(collectionName);

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
          if (result) resolve(result);
        });
    });
  }

  AsyncGetId(collectionName, request) {
    var collection = this.database.collection(collectionName);
    return new Promise((resolve, reject) => {
      collection.findOne(
        { _id: new ObjectID(request.params.id) },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (result != null) resolve(result);
          else resolve([]);
        }
      );
    });
  }

  AsyncExistId(collectionName, request) {
    var collection = this.database.collection(collectionName);
    return new Promise((resolve, reject) => {
      collection.findOne(
        { _id: new ObjectID(request.params.id) },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (result) resolve([{ count: 1 }]);
          else resolve([{ count: 0 }]);
        }
      );
    });
  }

  AsyncPost(collectionName, request) {
    var collection = this.database.collection(collectionName);
    return new Promise((resolve, reject) => {
      collection.insertOne(request.body, (error, result) => {
        if (error) reject(error);
        console.log("1 document " + result.body + " created.");
        resolve(result.insertedId);
      });
    });
  }

  AsyncPatchId(collectionName, request) {
    var collection = this.database.collection(collectionName);
    return new Promise((resolve, reject) => {
      collection.updateOne(
        { _id: new ObjectID(request.params.id) },
        { $set: request.body },
        (error, result) => {
          if (error) reject(error);
          resolve([result.modifiedCount]);
        }
      );
    });
  }

  AsyncCount(collectionName, request) {
    var collection = this.database.collection(collectionName);
    let query = {};
    if (request.body["query"] != null) query = request.body["query"];

    return new Promise((resolve, reject) => {
      collection.find(query).count((error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve([{ count: result }]);
      });
    });
  }

  AsyncDeleteId(collectionName, request) {
    var collection = this.database.collection(collectionName);
    var filter = { _id: new ObjectID(request.params.id) };
    return new Promise((resolve, reject) => {
      collection.deleteOne(filter, (error, result) => {
        if (error) reject(error);
        resolve([result.deletedCount]);
      });
    });
  }

  async GetCollectionOrTableNames(callback?: { (tableNames: string[]): void }) {
    var ret_val = [];
    var tableNames: string[] = [];
    this.database.listCollections().toArray((error, colInfo) => {
      colInfo.forEach(column => {
        if (column.type == "collection") {
          tableNames.push(column.name);
        }
      });
      callback(tableNames);
    });
  }
}
