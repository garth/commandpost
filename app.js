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
app.bayeux = new faye.NodeAdapter({
  mount: '/pubsub',
  timeout: 45
});
app.bayeux.attach(app.server);
app.pubsub = app.bayeux.getClient();

// prepare authorisation first
require('./server/authorise')(app, config, db);

// app.bayeux.on('handshake', function (clientId) {
//   console.log('handshake', clientId);
// });
// app.bayeux.on('subscribe', function (clientId, channel) {
//   console.log('subscribe', clientId, channel);
// });
// app.bayeux.on('publish', function (clientId, channel, data) {
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
