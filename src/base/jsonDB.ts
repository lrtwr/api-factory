import { DynamicObject } from "./custom";

export class DynamicClass<T> {
  constructor() { }
  [k: string]: T
}

export class JsonDatabase extends DynamicClass<any> {
  constructor(oArray: any[] = [], aProp: string[] = []) {
    super();
    if (oArray.length > 0 && aProp.length == 0) aProp = Object.keys(oArray[0]);
    if (oArray.length > 0 && aProp.length > 0) {
      if (!aProp) aProp = Object.keys(oArray[0]);
      this["_keys"] = [];
      aProp.forEach(prop => {
        this["_keys"].push(prop);
        if (!this[prop]) this[prop] = new DynamicClass<string>();

        oArray.forEach(obj => {
          if (!this[prop]["_keys"]) this[prop]["_keys"] = [];
          if (this[prop]["_keys"].indexOf(obj[prop]) == -1) this[prop]["_keys"].push(obj[prop]);
          if (!this[prop][obj[prop]]) this[prop][obj[prop]] = new DynamicClass<string>();
          if (!this[prop][obj[prop]]["_array"]) this[prop][obj[prop]]["_array"] = [];
          this[prop][obj[prop]]["_array"].push(obj);
          this[prop][obj[prop]]["_keys"] = [];

          aProp.forEach(prop2 => {
            this[prop][obj[prop]]["_keys"].push(prop2);

            if (prop2 != prop) {
              if (!this[prop][obj[prop]][prop2]) this[prop][obj[prop]][prop2] = new DynamicClass<string>();

              oArray.forEach(obj2 => {
                if (obj2 == obj) {
                  if (!this[prop][obj[prop]][prop2]["_keys"]) this[prop][obj[prop]][prop2]["_keys"] = [];
                  if (this[prop][obj[prop]][prop2]["_keys"].indexOf(obj2[prop2]) == -1) this[prop][obj[prop]][prop2]["_keys"].push(obj2[prop2]);
                  if (!this[prop][obj[prop]][prop2][obj2[prop2]]) this[prop][obj[prop]][prop2][obj2[prop2]] = new DynamicClass<string>();
                  if (!this[prop][obj[prop]][prop2][obj2[prop2]]["_array"]) this[prop][obj[prop]][prop2][obj2[prop2]]["_array"] = []
                  this[prop][obj[prop]][prop2][obj2[prop2]]["_array"].push(obj2);
                }
              })
            }
          })
        });
      });
    }
  }

  ["get"] = (searchArray: string[]) => {
    let obj: any = this;
    for (let key of searchArray) {
      if (obj[key]) {
        obj = obj[key];
      }
      else {
        obj = null;
        break;
      }
    }
    return obj;
  }
  ["exist"] = (searchArray: string[]) => {
    return this["get"](searchArray) != null ? true : false;
  }
}

export class ColumnPropertyJDB extends JsonDatabase {
  constructor(baseArray: any[]) { super(baseArray, []) }

  public tableNames(): string[] {
    return this.get(["table_type", "table", "table_name", "_keys"]) ?? [];
  };

  public viewNames(): string[] {
    return this.get(["table_type", "view", "table_name", "_keys"]) ?? [];
  };

  public tableExists(tableName: string): boolean {
    return this.exist(["table_name", tableName]);
  }

  public columnProperties(tableName: string) {
    return this.get(["table_name", tableName, "_array"]) ?? [];
  }

  public primaryKeyColumnName(tableName: string) {
    return this.get(["table_name", tableName, "column_is_pk", "1", "_array", "0", "column_name"]);
  }

  public primaryKeys(tableName: string) {
    let ret: DynamicObject = {};
    this.tableNames().forEach(table => {
      if (!tableName ||table == tableName) {
        this.table_name[table].column_is_pk["1"]._array.forEach((column: any) => ret[table] = column.column_name)
      }
    })
    return ret;
  }

  public models(tableName?: string) {
    const ret: DynamicObject = {};
    this.tableNames().forEach(table => {
      if (!tableName || tableName == table) {
        ret[table] = {};
        this.table_name[table]._array.forEach((column: any) => {
          ret[table][column.column_name] = column.data_type;
        });
      }
    });
    return ret;
  }
}


