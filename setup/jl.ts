export namespace jl {
  export interface DynamicObject {
    [k: string]: any;
  }

  export class jsonDatabase {
    public db: aObject;
    constructor(public baseArray: any[], aProp?: string[]) {
      this.db = new aObject(baseArray, aProp);
    }

    public GetPropArray = (
      oArray: jl.DynamicObject,
      propertyName: string
    ): string[] => {
      var ret_value: string[] = [];
      oArray.forEach(row => {
        if (ret_value.indexOf(row[propertyName]) == -1) {
          ret_value.push(row[propertyName]);
        }
      });
      return ret_value;
    };

    public FindFirstObjWithFilter = (
      firstSel,
      firstSelVal,
      secondSel,
      secondSelVal
    ): any => {
      const objs: any[] = this.db[firstSel][secondSel];
      objs.forEach(column => {
        if (column[secondSel] == secondSelVal) return column;
      });
    };
    public Find(filter: DynamicObject) {
      var ret_value: any[] = [];
      this.baseArray.forEach(column => {
        var doReturn: number = 1;
        Object.keys(filter).forEach(prop => {
          if (doReturn) {
            if (column[prop] != filter[prop]) {
              doReturn = 0;
            }
          }
        });
        if (doReturn) ret_value.push(column);
      });
      return ret_value;
    }
  }

  export class aObject {
    constructor(oArray: any[], aProp?: string[]) {
      if(oArray){
      if (oArray.length > 0) {
        if (!aProp) aProp = Object.keys(oArray[0]);
        aProp.forEach(prop => {
          if (!this[prop]) this[prop] = {};
          oArray.forEach(obj => {
            if (!this[prop][obj[prop]]) this[prop][obj[prop]] = [];
            this[prop][obj[prop]].push(obj);
          });
        });
      }
    }
  }
    [k: string]: { [k: string]: any[] };
  }
}
