var http = require('http');
var express = require('express');
var faye = require('faye');
var fs = require('fs');
var config = require('./server/config/config')();
var path = require('path');

// connect to the db and init model schemas
var db = require('./server/config/mongoose')(config);

// setup express
var app = express();
require('./server/config/express')(app, config);
app.server = http.createServer(app);

// setup faye pub sub
var bayeux = new faye.NodeAdapter({
  mount: '/pubsub',
  timeout: 45
});
bayeux.attach(app.server);
app.pubsub = bayeux.getClient();

// bayeux.on('handshake', function (clientId) {
//   console.log('handshake', clientId);
// });
// bayeux.on('subscribe', function (clientId, channel) {
//   console.log('subscribe', clientId, channel);
// });
// bayeux.on('publish', function (clientId, channel, data) {
//   console.log('publish', clientId, channel, data);
// });

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
