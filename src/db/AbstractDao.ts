import { JsonDatabase, DynamicObject } from "../base/custom";
import { ApiDbHandler } from "./apiDbHandler";
import { RequestInfo } from '../base/RequestInfo';
import { AbstractSQL, ISQLBasic } from "../sql/abstractSql";

export interface IDaoBasic {
  connect(): any;
  addItem(requestInfo: RequestInfo, body: { [k: string]: any }, callback: any): any;
  updateItem(requestInfo: RequestInfo, id: any, body: { [k: string]: any }, callback: any): any;
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
  public tableProperties: JsonDatabase;
  public sqlStatements: ISQLBasic&AbstractSQL;
  constructor() {}

  public tableExists(requestInfo: RequestInfo): boolean {
    if (this.tableProperties.db.table_name) {
      return (this.tableProperties.db.table_name[requestInfo.tableName]) ? true : false;
    }
    else return false;
  }

  public columnProperties(requestInfo: RequestInfo) {
    if (this.tableProperties.db.table_name) return this.tableProperties.db.table_name[requestInfo.unitId];
    return null;
  }

  public primaryKeyColumnName(requestInfo: RequestInfo) {
    let ret: string;
    this.tableProperties.db.table_name[requestInfo.unitId].forEach(column => {
      if (column.column_is_pk) {
        ret = column.column_name;
      }
    });
    return ret;
  }

  public primaryKeys(tableName?: string) {
    let ret: DynamicObject = {};
    const tables: string[] = this.tableNames();
    tables.forEach(table => {
      this.tableProperties.db.table_name[table].forEach(column => {
        if (!tableName || tableName == table) { if (column.column_is_pk) ret[table] = column.column_name; }
      })
    })
    return ret;
  }

  public models(tableName?: string) {
    const tables: string[] = this.tableNames();
    const ret: DynamicObject = {};
    let columns: string[];
    let model: DynamicObject;
    tables.forEach(table => {
      model = {};
      if (!tableName || tableName == table) {
        this.tableProperties.db.table_name[table].forEach((column) => {
          model[column.column_name] = column.data_type;
        });
        ret[table] = model;
      }
    });
    return ret;
  }

  public tableNames(): string[] {
    if (!this.tableProperties.db.table_type) return [];
    else if (!this.tableProperties.db.table_type.table) return [];
    return this.tableProperties.GetPropArray(
      this.tableProperties.db.table_type.table,
      "table_name"
    );
  };

  public viewNames (): string[] {
    if (!this.tableProperties.db.table_type) return [];
    else if (!this.tableProperties.db.table_type.view) return [];
    return this.tableProperties.GetPropArray(
      this.tableProperties.db.table_type.view,
      "table_name"
    );
  };
}




