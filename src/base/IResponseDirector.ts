

export interface IResponseDirector {
    post(unitId: string, request:any, response: any): any;
    get(unitId: string, request:any, response: any): any;
    getId(unitId: string, request:any, response: any): any;
    put(unitId: string, request:any, response: any): any;
    putId(unitId: string, request:any, response: any): any;
    patch(unitId: string, request:any, response: any): any;
    patchId(unitId: string, request:any, response: any): any;
    existId(unitId: string, request:any, response: any): any;
    deleteId(unitId: string, request:any, response: any): any;
    getCount(unitId: string, request:any, response: any): any;
    createTable( request:any, response: any): any;
    deleteTable( request:any, response: any): any;
    createColumn( request:any, response: any): any;
    createForeignKey( request:any, response: any): any;
    error(error: Error, request:any, response: any): any;
  }