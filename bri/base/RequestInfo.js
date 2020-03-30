"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestInfo = /** @class */ (function () {
    function RequestInfo(request, unitId) {
        if (unitId === void 0) { unitId = ""; }
        var _a, _b, _c, _d, _e, _f, _g;
        this.unitId = unitId;
        this.mongoProjection = {};
        this.mongoQuery = {};
        this.mongoSort = {};
        this.cosmosQuery = {};
        this.cosmosSort = {};
        this.sqlselect = "";
        this.sqlwhere = "";
        this.sqlorder = "";
        var body = request.body;
        this.id = request.params.id;
        this.tableName = request.params.tablename;
        this.columnName = request.params.columnname;
        if (!this.id)
            this.id = (_a = request.params.id, (_a !== null && _a !== void 0 ? _a : request.query.id));
        if (!this.unitId)
            this.unitId = request.query["unitId"];
        if (!this.unitId)
            this.unitId = (_b = request.params["tablename"], (_b !== null && _b !== void 0 ? _b : request.query["tablename"]));
        if (!this.unitId)
            this.unitId = request.query["table"];
        if (!this.unitId)
            this.unitId = request.query["collection"];
        if (!this.unitId)
            this.unitId = request.query["container"];
        this.columnName = (_d = (_c = request.params["columnname"], (_c !== null && _c !== void 0 ? _c : request.query["columnname"])), (_d !== null && _d !== void 0 ? _d : request.query["column"]));
        this.dataType = (_f = (_e = request.params["datatype"], (_e !== null && _e !== void 0 ? _e : request.query["datatype"])), (_f !== null && _f !== void 0 ? _f : "string"));
        this.targetTable = (_g = request.params["targettable"], (_g !== null && _g !== void 0 ? _g : request.query["targettable"]));
        if (this.dataType)
            this.dataType = this.dataType.toLowerCase();
        this.originalUnitId = this.unitId;
        if (this.unitId)
            this.unitId = this.unitId.toLowerCase();
        this.tableName = this.unitId;
        if (body) {
            if (body["insert"] != null)
                this.updateBody = body["insert"];
            if (body["update"] != null)
                this.updateBody = body["update"];
            if (body["select"] != null)
                this.sqlselect = body["select"];
            if (body["where"] != null)
                this.sqlwhere = body["where"];
            if (body["order"] != null)
                this.sqlorder = body["order"];
            if (body["mongoQuery"] != null)
                this.mongoQuery = body["mongoQuery"];
            if (body["mongoSort"] != null)
                this.mongoSort = body["mongoSort"];
            if (body["projection"] != null)
                this.mongoProjection = body["projection"];
            if (body["cosmosQuery"] != null)
                this.cosmosQuery = body["cosmosQuery"];
            if (body["cosmosSort"] != null)
                this.cosmosSort = body["cosmosSort"];
            if (body["query"] != null)
                this.mongoQuery = body["query"];
            if (body["sort"] != null)
                this.mongoSort = body["sort"];
            this.__pageLength = body["pagelength"];
            this.__pageNumber = body["pagenumber"];
        }
        this.method = request.method;
    }
    return RequestInfo;
}());
exports.RequestInfo = RequestInfo;
//# sourceMappingURL=requestInfo.js.map