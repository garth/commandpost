var express = require('express');
var fs = require('fs');
var config = require('./server/config/config')();
var path = require('path');

var db = require('./server/config/mongoose')(config);

// setup express
var app = express();
require('./server/config/express')(app, config);

// load the controllers
var controllersPath = path.join(config.root, 'server/controllers');
fs.readdirSync(controllersPath).forEach(function (file) {
  if (file.match(/\.js/)) {
    require(path.join(controllersPath, file))(app, config, db);
  }
});

// start the server
app.listen(config.port);
console.log('Mogul listening on port ' + config.port + ' in ' + config.env + ' mode');
