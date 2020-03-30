import { DynamicObject } from './custom';
export class RequestInfo {
  public mongoProjection = {};
  public mongoQuery = {};
  public mongoSort = {};
  public cosmosQuery = {};
  public cosmosSort = {};
  public sqlselect = "";
  public sqlwhere = "";
  public sqlorder = "";
  public updateBody: any;
  public __pageLength: number;
  public __pageNumber: number;
  public tableName: string;
  public columnName: string;
  public dataType: string;
  public targetTable: string;
  public id: any;
  public method: string;
  public originalUnitId: string;

  constructor(request: any, public unitId: string = "") {

    const body = request.body;
    this.id = request.params.id;
    this.tableName = request.params.tablename;
    this.columnName = request.params.columnname;
    if (!this.id) this.id = request.params.id ?? request.query.id;
    if (!this.unitId) this.unitId = request.query["unitId"];
    if (!this.unitId) this.unitId = request.params["tablename"] ?? request.query["tablename"];
    if (!this.unitId) this.unitId = request.query["table"];
    if (!this.unitId) this.unitId = request.query["collection"];
    if (!this.unitId) this.unitId = request.query["container"];

    this.columnName = request.params["columnname"] ?? request.query["columnname"] ?? request.query["column"];
    this.dataType = (request.params["datatype"] ?? request.query["datatype"] ?? "string");
    this.targetTable = request.params["targettable"] ?? request.query["targettable"];
    if (this.dataType) this.dataType = this.dataType.toLowerCase();
    this.originalUnitId = this.unitId;
    if (this.unitId) this.unitId = this.unitId.toLowerCase();
    this.tableName = this.unitId;

    if (body) {
      if (body["insert"] != null) this.updateBody = body["insert"];
      if (body["update"] != null) this.updateBody = body["update"];
      if (body["select"] != null) this.sqlselect = body["select"];
      if (body["where"] != null) this.sqlwhere = body["where"];
      if (body["order"] != null) this.sqlorder = body["order"];
      if (body["mongoQuery"] != null) this.mongoQuery = body["mongoQuery"];
      if (body["mongoSort"] != null) this.mongoSort = body["mongoSort"];
      if (body["projection"] != null) this.mongoProjection = body["projection"];
      if (body["cosmosQuery"] != null) this.cosmosQuery = body["cosmosQuery"];
      if (body["cosmosSort"] != null) this.cosmosSort = body["cosmosSort"];
      if (body["query"] != null) this.mongoQuery = body["query"];
      if (body["sort"] != null) this.mongoSort = body["sort"];
      this.__pageLength = body["pagelength"];
      this.__pageNumber = body["pagenumber"];
    }
    this.method = request.method;
  }
}