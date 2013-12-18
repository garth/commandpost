var _ = require('underscore');

var openConnections = [];

require('../helpers/history').notify(function (doc) {
  var id = (new Date()).getMilliseconds();
  var event = doc.action;
  var data = JSON.stringify(doc);
  // notify each client
  openConnections.forEach(function (res) {
    res.write('id: ' + id + '\n');
    res.write('event: ' + event + '\n');
    res.write('data: ' + data + '\n\n'); // extra newline is required
  });
});

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/history', authorise, function (req, res, next) {
    // set timeout as high as possible
    req.socket.setTimeout(Infinity);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // push this res object to our global variable
    openConnections.push(res);

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
      openConnections = _.without(openConnections, res);
    });
  });
};
