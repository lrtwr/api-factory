export class ApiSQLStatements {
  // static GetSelectStatement(tableName) {
  //   return `select * from ${tableName};`;
  // }

  static GetSelectWithIdStatement(tableName, identityColumn, id) {
    return `select * from ${tableName} where ${identityColumn} = ${id};`;
  }

  static GetDeleteWithIdStatement(tableName, identityColumn, id) {
    return `Delete from ${tableName} where ${identityColumn} = ${id};`;
  }

  static GetIdExistStatement(tableName, identityColumn, id) {
    return `SELECT ${identityColumn} FROM ${tableName} where ${identityColumn} = ${id}`;
  }
  static GetCountStatement(tableName) {
    return `SELECT COUNT(*) AS count FROM ${tableName}`;
  }

  static GetMySQLTableColumnInfoStatement(databaseName) {
    return `Select 
    col.table_schema as table_schema,
    case 
   when vie.table_type = 'BASE TABLE' then 'table' 
   when vie.table_type = 'VIEW' then 'view' 
   else 'other' 
   end as table_type,
    col.table_name as table_name, 
    col.column_name as column_name, 
    col.column_default as default_val, 
    col.is_nullable = "YES" as is_nullable, 
    upper(col.data_type) as data_type, 
    col.column_key='PRI' as column_is_pk  
    FROM information_schema.columns col 
join information_schema.tables vie on vie.table_schema = col.table_schema
                              and vie.table_name = col.table_name
where col.table_schema not in ('sys','information_schema',
                           'mysql', 'performance_schema')
and vie.table_schema = '${databaseName}' 
order by col.table_name, col.ordinal_position;
`;
  }

  static GetSQLiteTableColumnInfoStatement() {
    return `SELECT m.name AS table_name, 
    p.name AS column_name,
    m.type As table_type,
    p.type AS data_type,
	p.pk AS column_is_pk
  FROM sqlite_master m
  JOIN pragma_table_info((m.name)) p
WHERE table_name <> 'sqlite_sequence'
  ORDER BY table_name`;
  }

  static GetMSSQLTableColumnInfoStatement() {
    return `SELECT 
    n.name as table_name, 
n.table_type,
    c.name as column_name, 
    c. is_identity as column_is_pk, 
    UPPER(s.name) as data_type 
    from (select name, type_desc, object_id, 'table' as table_type from sys.tables where name <> '__EFMigrationsHistory'
    union 
  select name, type_desc, object_id, 'view' as table_type from sys.views) n 
    left outer join sys.columns c 
      on n.object_id = c.object_id  
      join sys.systypes s 
      on c.system_type_id = s.xtype 
      where s.name <> 'sysname' `;
  }

  static GetCountSelectFromJsonBody(tableName, request) {
    const body = request.body;
    let selectPart = "";
    let wherePart = "";
    let orderPart = "";
    const where: string = body["where"];
    const order: string = body["order"];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageLength = body["pagelength"];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageNumber = body["pagenumber"];

    selectPart = `SELECT COUNT(*) AS count FROM ${tableName}`;
    if (where) wherePart = ` where ${where}`;
    if (order) orderPart = ` order by ${order}`;
    return (selectPart + wherePart + orderPart).trim() + ";";
  }
  static GetSelectFromJsonBody(tableName, request) {
    const body = request.body;
    let selectPart = "";
    let wherePart = "";
    let orderPart = "";
    let select = "";
    let where = "";
    let order = "";

    if (body["select"] != null) select = body["select"];
    if (body["where"] != null) where = body["where"];
    if (body["order"] != null) order = body["order"];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageLength = body["pagelength"];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageNumber = body["pagenumber"];

    if (select.trim() == "") select = "*";

    selectPart = `Select ${select} from ${tableName}`;
    if (where) wherePart = ` where ${where}`;
    if (order) orderPart = ` order by ${order}`;
    return (selectPart + wherePart + orderPart).trim() + ";";
  }

  static GetUpdateStatement(
    tableName,
    identityColumn,
    tableColumnProperties,
    request
  ) {
    const sql = `Update ${tableName} Set `;
    const setArray = [];
    const updateInfo = request.body.update != null ? request.body.update : {};

    for (let i = 0; i < tableColumnProperties.length; i++) {
      const prop = tableColumnProperties[i];
      if (updateInfo[prop.column_name] != null) {
        if (prop.column_is_pk == 0) {
          setArray.push(prop.column_name + " = ");
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

  static GetInsertStatement(tableName, columnProperties, request) {
    const sql = `Insert into ${tableName} `;
    const asqlColumns = [];
    const asqlValues = [];
    let insertInfo = {};
    if (request.body.update) insertInfo = request.body.update;
    if (request.body.insert) insertInfo = request.body.insert;

    for (let i = 0; i < columnProperties.length; i++) {
      const prop = columnProperties[i];
      if (insertInfo[prop.column_name] != null) {
        if (prop.column_is_pk == 0) {
          asqlColumns.push(prop.column_name);
          switch (prop.data_type) {
            case "TEXT":
            case "NVARCHAR":
            case "VARCHAR":
              asqlValues.push("'" + insertInfo[prop.column_name] + "'");
              break;
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
      sql +
      "(" +
      asqlColumns.join(", ") +
      ") Values (" +
      asqlValues.join(", ") +
      ")"
    );
  }
}
