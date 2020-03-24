import { ApiServer } from './../imp/ApiServer';
import { RequestInfo } from '../base/RequestInfo';
import { DynamicObject, Configuration } from '../base/custom';

const CosmosClient = require('@azure/cosmos').CosmosClient
import { AbstractDao, IDaoBasic } from './AbstractDao';
import { RunningStatus } from '../base/custom';
import { enumRunningStatus } from '../base/enums';
import { AbstractApiRouting } from '../imp/ApiRouting';

export class DaoCosmos extends AbstractDao implements IDaoBasic {
    public primaryKeyColumnName(requestInfo: RequestInfo) { return "id"; }

    createForeignKey(requestInfo: RequestInfo, callback: any) {
        throw new Error("Method not implemented.");
    }

    async createTable(requestInfo: RequestInfo, callback: any) {
        await this.db.containers.createIfNotExists({ id: requestInfo.originalUnitId })
            .then((result: any) => {
                this.getDbInfo();
                callback(null, 1);
            })
            .catch((error: Error) => {
                callback(error)
            })
    }

    async deleteTable(requestInfo: RequestInfo, callback: any) {
        let collection = this.db.container(requestInfo.originalUnitId);
        await collection.delete()
            .then(() => {
                this.getDbInfo();
                callback(null, 1)
            })
            .catch((error: Error) => {
                callback(error);
            })
    }

    createColumn<T>(requestInfo: RequestInfo, callback: any) {
        throw new Error("Method not implemented.");
    }

    executeSql(sql: string, callback: any) {
        throw new Error("Method not implemented.");
    }

    cosmosCollectionNames: string[] = [];
    cosmosViewNames: string[] = [];
    taskDao: any;
    client: any;
    public config: Configuration;
    public status: RunningStatus;
    constructor(
        public server: any,
        public callback?: { (error: Error, routing: AbstractApiRouting): void }
    ) {
        super();
        this.config = server.config;
        this.status = server.status;
    }

    itemExists(requestInfo: RequestInfo, itemId: any, callback: any) {
        this.getItem(requestInfo, itemId, (error: Error, result: any) => {
            if (error) callback(error);
            if (result) callback(null, result.length);
        });
    }

    async connect() {
        const self = this;
        this.status.DbConnect = enumRunningStatus.DbConnectInitializing;
        const endpoint = this.config.host;   //"https://your-account.itemResponseuments.azure.com"; // Add your endpoint
        const key = this.config.authKey; // Add the masterkey of the endpoint

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        this.client = new CosmosClient({ endpoint, key });
        await this.client.databases.createIfNotExists({ id: this.config.databaseId })
            .then((db: any) => {
                self.db = db.database;
                console.log("Connected to CosmosDb: `" + self.config.databaseId + "` on process:" +process.pid+".");
                self.status.DbConnect = enumRunningStatus.DbConnectConnected;
            })
            .catch((error: Error) => {
                console.log(error)
                self.status.DbConnect = enumRunningStatus.DbConnectError;
            });

        //const collectionDefinition = { id: this.config.collectionId };
        //const itemResponseumentDefinition = { id: "hello world itemResponse", content: "Hello World!" };
        //const collection = await this.db.containers.createIfNotExists({ id: "Branch" });
        this.getDbInfo((error: Error, result: any) => {
            if (error) self.server.addError(error);
            if (result) {
                if (result == "1") {
                    self.callback(null, self.server.routing);
                    this.status.DbConnect = enumRunningStatus.DbConnectConnected;
                    console.log("Connected to MSSQL: `" + this.config.database + "`!");
                }
            }
        })
    }

    async getDbInfo(callback?: any) {
        this.cosmosCollectionNames = [];
        const iterator = this.db.containers.readAll();
        const { resources: containersList } = await iterator.fetchAll((result: any) => { console.log(result); console.log("GetDbInfo Cosmos") });
        containersList.forEach((item: any) => {
            this.cosmosCollectionNames.push(item.id)
        });
        if (callback) callback(null, "1");
    }

    async getAllItems(requestInfo: RequestInfo, callback: any) {
        //jeroen query, sort en projection nog regelen
        var collection = this.db.container(requestInfo.originalUnitId)
        try {
            const { resources } = await collection.items.readAll().fetchAll();
            callback(null, resources);
        } catch (error) {
            callback(error);
        }
    }

    async countItems(requestInfo: RequestInfo, callback: any) {
        var collection = this.db.container(requestInfo.originalUnitId);
        this.getAllItems(requestInfo, (error: Error, result: any) => {
            if (error) callback(error);
            if (result) callback(null, (result.lenght));
            callback(null, 0);
        });
    }

    async getItem(requestInfo: RequestInfo, itemId: any, callback: any) {
        var collection = this.db.container(requestInfo.originalUnitId)
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };
        try {
            const { resources } = await collection.items.query(querySpec, { enableCrossPartitionQuery: true }).fetchAll();
            callback(null, resources);
        } catch (error) {
            callback(error);
        }
    }

    async addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any) {
        var collection = this.db.container(requestInfo.originalUnitId)
        let itemResponse: any;
        body.date = Date.now();
        body.completed = false;
        try {
            itemResponse = await collection.items.create(body);
            callback(null, itemResponse.item.id)
        } catch (error) {
            callback(error)
        }
    }

    async updateItem(requestInfo: RequestInfo, id: any, body: { [k: string]: any }, callback: any) {
        var collection = this.db.container(requestInfo.originalUnitId);
        const newBody: DynamicObject = {};
        Object.keys(body).forEach(key => {
            newBody[key] = body[key];
        });
        if (id) newBody["id"] = id;
        try {
            const result = await collection.items.upsert(newBody);
            callback(null, result);
        } catch (error) {
            callback(error);
        }
    }

    tableExists(requestInfo: RequestInfo): boolean {
        let ret: boolean = false;
        this.cosmosCollectionNames.forEach((col) => {
            if (col == requestInfo.originalUnitId) ret = true;
        })
        return ret;
    }

    async deleteItem(requestInfo: RequestInfo, itemId: any, callback: any) {
        var collection = this.db.container(requestInfo.originalUnitId)
        try {
            let itemResponse = await collection.item(itemId).delete();
            callback(null, itemResponse)
        } catch (error) {
            callback(error);
        }
    }

    GetTableNames = (): string[] => {
        return this.cosmosCollectionNames;
    };

    GetViewNames = (): string[] => {
        return this.cosmosViewNames;
    };

    GetPrimaryKeys = (): DynamicObject => {
        const ret: DynamicObject = {};
        const tableNames = this.GetTableNames();
        tableNames.forEach(table => {
            ret[table] = "id";
        });
        return ret;
    }
}
