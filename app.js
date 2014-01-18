var http = require('http');
var express = require('express');
var fs = require('fs');
var config = require('./server/config/config')();
var path = require('path');

// log unhandled exceptions
process.addListener('uncaughtException', function (err) {
  console.log('Uncaught exception:', err);
});

// connect to the db and init model schemas
var db = require('./server/config/mongoose')(config);

// setup express
var app = express();
require('./server/config/express')(app, config);
app.server = http.createServer(app);

// init pub sub system
require('./server/pubsub')(app, config, db);

// prepare authorisation
require('./server/authorise')(app, config, db);

// load the controllers
var controllersPath = path.join(config.root, 'server/controllers');
fs.readdirSync(controllersPath).forEach(function (file) {
  if (file.match(/\.js/)) {
    require(path.join(controllersPath, file))(app, config, db);
  }
});

// start the server
app.server.listen(config.port);
console.log('Mogul listening on port ' + config.port + ' in ' + config.env + ' mode');
