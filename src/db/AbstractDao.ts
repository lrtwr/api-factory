import { RequestInfo } from '../base/requestInfo';
import { AbstractSQL, ISQLBasic } from "../sql/abstractSql";
import { ColumnPropertyJDB } from "../base/jsonDB";

export interface IDaoBasic {
  connect(): any;
  addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any): any;
  updateItem(requestInfo: RequestInfo, id: any, body: { [k: string]: any }, callback: any): any;
  updateAll(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any): any;
  getItem(requestInfo: RequestInfo, itemId: string, callback: any): any;
  itemExists(requestInfo: RequestInfo, itemId: string, callback: any): any;
  getAllItems(requestInfo: RequestInfo, callback: any): any;
  deleteItem(requestInfo: RequestInfo, id: string, callback: any): any
  countItems(requestInfo: RequestInfo, callback: any): any
  createTable(requestInfo: RequestInfo, callback: any): any;
  deleteTable(requestInfo: RequestInfo, callback: any): any;
  createColumn(requestInfo: RequestInfo, callback: any): any;
  createForeignKey(requestInfo: RequestInfo, callback: any): any;
  executeSql(sql: string, callback: any): any;
  tableExists(requestInfo: RequestInfo): boolean;
  primaryKeyColumnName(requestInfo: RequestInfo):any;
  columnProperties(requestInfo: RequestInfo):any;
  primaryKeys(tableName?: string): any;
  models(tableName?: string):any;
  tableNames(): string[];
  viewNames(): string[];
}

export abstract class AbstractDao  {
  public db: any;
  public dbInfo: ColumnPropertyJDB;
  public sqlStatements: ISQLBasic&AbstractSQL;
  constructor() {}

  public models = (tableName?: string) => {return this.dbInfo.models(tableName)}
  public primaryKeys=(tableName?: string)=>{return this.dbInfo.primaryKeys(tableName)}
  public tableNames=():string[]=>{return this.dbInfo.tableNames();}
  public viewNames=():string[]=>{return this.dbInfo.viewNames();}
  public tableExists=(requestInfo: RequestInfo):boolean=>{return this.dbInfo.tableExists(requestInfo.tableName);}
  public columnProperties=(requestInfo: RequestInfo)=>{return this.dbInfo.columnProperties(requestInfo.tableName);}
  public primaryKeyColumnName=(requestInfo: RequestInfo)=>{return this.dbInfo.primaryKeyColumnName(requestInfo.tableName);}
}




