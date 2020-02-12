import * as api from './ApiFactory';

api.Connect(api.defaultMSSQL);
api.Connect(api.defaultMariaDB);
api.Connect(api.defaultMongoExtern1);
api.Connect(api.defaultSQLite);