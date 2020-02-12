"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api = require("./ApiFactory");
api.Connect(api.defaultMSSQL);
api.Connect(api.defaultMariaDB);
api.Connect(api.defaultMongoExtern1);
api.Connect(api.defaultSQLite);
//# sourceMappingURL=index.js.map