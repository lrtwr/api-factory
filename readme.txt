Creating an api-server for MS-SQL, MySQL, MongoDB, SQLite and MariaDB real easy.

npm install apimatic

this js-code is an example of how to run an apimatic apiserver.

Microsoft SQL-server

var api = require("apimatic");
var config = api.CreateMSSQLConfiguration({
  listenPort: apiportnumber,
  database: "databaseName",
  user: "username",
  password: "password",
  server: "server"
})

api.Connect(config);

Now look with an apitool at apiHostIp:portnumber/status
example 127.0.0.1:6800/status

You will get the status and a list of possible apis.



MySQL- or MariaDB-servers.

var api = require("apimatic");
 var config = CreateMySQLConfiguration({
  user: "username",
  password: "password",
  host: "hostaddress",
  listenPort: "apiportnumber",
  database: "databasename",
  port: "sqlserverport"
});
api.Connect(config);


Example MongoDB servers

var api = require("apimatic");
var config = CreateMongoConfiguration({
  connectionString: "mongo connectionstring",
  database: "AngSQL",
  listenPort: 6803
});
api.Connect(config);

var api = require("apimatic");
var config = CreateSQLiteConfiguration({
  connectionString: `Data Source=sqlitefilename.db;`,
  listenPort: listenPortnumber,
  database: "sqlitefilename.db"
});
api.Connect(config);





