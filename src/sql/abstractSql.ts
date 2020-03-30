import { RequestInfo } from '../base/requestInfo';

export interface ISQLBasic {
    tableColumnInfo(databaseName: string): string;
    createTable(requestInfo: RequestInfo): string;
    deleteTable(requestInfo: RequestInfo): string;
    createColumn<T>(requestInfo: RequestInfo): string;
}
export abstract class AbstractSQL {

    selectWithId = (requestInfo: RequestInfo, identityColumn: string, id: string) => {
        return `select * from ${requestInfo.tableName} where ${identityColumn} = '${id}';`;
    }

    deleteWithId(requestInfo: RequestInfo, identityColumn: string, id: string) {
        return `Delete from ${requestInfo.tableName} where ${identityColumn} = ${id};`;
    }

    idExist(requestInfo: RequestInfo, identityColumn: string, id: string) {
        return `SELECT ${identityColumn} FROM ${requestInfo.tableName} where ${identityColumn} = ${id}`;
    }

    count(requestInfo: RequestInfo) {
        return `SELECT COUNT(*) AS count FROM ${requestInfo.tableName}`;
    }

    countSelectRequestInfo(requestInfo: RequestInfo) {
        let selectPart = "";
        let wherePart = "";
        let orderPart = "";

        selectPart = `SELECT COUNT(*) AS count FROM ${requestInfo.tableName}`;
        if (requestInfo.sqlwhere) wherePart = ` where ${requestInfo.sqlwhere}`;
        if (requestInfo.sqlorder) orderPart = ` order by ${requestInfo.sqlorder}`;
        return (selectPart + wherePart + orderPart).trim() + ";";
    }

    selectFromRequestInfo(requestInfo: RequestInfo) {
        let selectPart = "";
        let wherePart = "";
        let orderPart = "";

        if (requestInfo.sqlselect.trim() == "") requestInfo.sqlselect = "*";

        selectPart = `Select ${requestInfo.sqlselect} from ${requestInfo.tableName}`;
        if (requestInfo.sqlwhere) wherePart = ` where ${requestInfo.sqlwhere}`;
        if (requestInfo.sqlorder) orderPart = ` order by ${requestInfo.sqlorder}`;
        return (selectPart + wherePart + orderPart).trim() + ";";
    }

    updateWithIdFromBody(
        requestInfo: RequestInfo,
        id: any,
        identityColumn: string,
        tableColumnProperties: any,
        updateInfo: { [x: string]: any; }, lDelimiter: string = "'", rDelimiter: string = "'"
    ) {

        let sql = `Update ${lDelimiter}${requestInfo.tableName}${rDelimiter} Set `;
        const setArray = [];
        let pkDataType: string = "";
        let pkDelimiter: string = "";
        for (let i = 0; i < tableColumnProperties.length; i++) {
            const prop = tableColumnProperties[i];

            if (id) if (prop.column_name == identityColumn) pkDataType = prop.data_type;
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push(lDelimiter + prop.column_name + rDelimiter + "=");
                    switch (prop.data_type) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            setArray[setArray.length - 1] +=
                                "'" + updateInfo[prop.column_name] + "'";
                            break;
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            setArray[setArray.length - 1] += updateInfo[prop.column_name];
                            break;
                    }
                }
            }
        }
        if (id) {
            switch (pkDataType) {
                case "TEXT":
                case "UNIQUEIDENTIFIER":
                case "NVARCHAR":
                case "VARCHAR":
                    pkDelimiter = "'";
                    break;
            }
        }
        sql += setArray.join(", ");
        if (id) + ` Where ${identityColumn}=${pkDelimiter}${id}${pkDelimiter}`
        return sql;
    }

    updateFromBody(
        requestInfo: RequestInfo,
        tableColumnProperties: any,
        updateInfo: { [x: string]: any; }, lDelimiter: string = "'", rDelimiter: string = "'"
    ) {

        let sql = `Update ${lDelimiter}${requestInfo.tableName}${rDelimiter} Set `;
        const setArray = [];
        for (let i = 0; i < tableColumnProperties.length; i++) {
            const prop = tableColumnProperties[i];
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push(lDelimiter + prop.column_name + rDelimiter + "=");
                    switch (prop.data_type) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            setArray[setArray.length - 1] +=
                                "'" + updateInfo[prop.column_name] + "'";
                            break;
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            setArray[setArray.length - 1] += updateInfo[prop.column_name];
                            break;
                    }
                }
            }
        }
        sql += setArray.join(", ");
        let wherePart:string[] = [];
        if (requestInfo.sqlwhere) {
            if (typeof requestInfo.sqlwhere == "object") {
                let whereBody:{[k:string]:any}=requestInfo.sqlwhere
                Object.keys(whereBody).forEach((key: string) => {
                    wherePart.push(`${key}='${whereBody[key]}'`)
                })
                sql += " Where " + wherePart.join(" And ");
            }
            else if (typeof requestInfo.sqlwhere == "string") {
                sql += " Where " + requestInfo.sqlwhere;
            }
        }
        return sql;
    }

    update(
        requestInfo: RequestInfo,
        identityColumn: string,
        tableColumnProperties: any,
        request: { body: { update: any; }; params: { id: any; }; }
    ) {
        const sql = `Update ${requestInfo.tableName} Set `;
        const setArray = [];
        const updateInfo = request.body.update != null ? request.body.update : {};
        for (let i = 0; i < tableColumnProperties.length; i++) {
            const prop = tableColumnProperties[i];
            if (updateInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    setArray.push("'" + prop.column_name + "' = ");
                    switch (prop.data_type) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            setArray[setArray.length - 1] +=
                                "'" + updateInfo[prop.column_name] + "'";
                            break;
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            setArray[setArray.length - 1] += updateInfo[prop.column_name];
                            break;
                    }
                }
            }
        }
        return (
            sql +
            setArray.join(", ") +
            ` Where ${identityColumn}=${request.params.id}`
        );
    }

    insert(requestInfo: RequestInfo, body: { [k: string]: any }, columnProperties: any[], ldelimiter: string = "[", rdelimiter: string = "]") {
        const sql = `Insert into ${requestInfo.tableName} `;
        const asqlColumns = [];
        const asqlValues = [];
        let primaryKey: string;
        let insertInfo: { [k: string]: any; } = body;
        for (let i = 0; i < columnProperties.length; i++) {
            const prop = columnProperties[i];
            if (prop.column_is_pk == 1) primaryKey = prop.column_name;
            if (insertInfo[prop.column_name] != null) {
                if (prop.column_is_pk == 0) {
                    asqlColumns.push(prop.column_name);
                    switch (prop.data_type.toUpperCase()) {
                        case "TEXT":
                        case "NVARCHAR":
                        case "VARCHAR":
                            insertInfo[prop.column_name] = insertInfo[prop.column_name].replace("'", "''");
                        case "DATE":
                            asqlValues.push("'" + insertInfo[prop.column_name] + "'");
                            break;
                        case "BOOL":
                        case "BOOLEAN":
                        case "TINYINT":
                        case "FLOAT":
                        case "INTEGER":
                        case "REAL":
                        case "NUMERIC":
                        case "INT":
                        case "BIGINT":
                            asqlValues.push(insertInfo[prop.column_name]);
                            break;
                    }
                }
            }
        }
        return (
            sql + "(" + ldelimiter + asqlColumns.join(rdelimiter + "," + ldelimiter) +
            rdelimiter + ") Values (" + asqlValues.join(", ") + ")");
    }
}