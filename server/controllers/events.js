var mongoose = require('mongoose');
var History = mongoose.model('History');
var _ = require('underscore');
var _s = require('underscore.string');

var openConnections = [];

var sendDoc = function (res, doc) {
  res.write('id: ' + doc.id + '\n');
  res.write('event: ' + doc.action + _s.capitalize(doc.documentType) + '\n');
  res.write('data: ' + JSON.stringify(doc) + '\n\n'); // extra newline is required
};

require('../helpers/history').notify(function (doc) {
  // notify each client
  openConnections.forEach(function (res) {
    sendDoc(res, doc);
  });
});

// ping clients every 15 seconds to keep the connection open
setInterval(function () {
  openConnections.forEach(function (res) {
    res.write('event: ping\ndata:\n\n');
  });
}, 15 * 1000);

var sendDocsSince = function (res, lastId) {
  History.find({ _id: { $gt: lastId }}, function (err, docs) {
    if (!err) {
      docs.forEach(function (doc) {
        sendDoc(res, doc.toJSON());
      });
    }
  });
};

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config, true);

  app.get('/api/events', authorise, function (req, res, next) {
    // set timeout as high as possible
    req.socket.setTimeout(Infinity);

    // send headers for event-stream connection
    // see spec for more information
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.write('\n');

    // drop unauthorised connections every 5 seconds (client will reconnect)
    if (!req.user) {
      setTimeout(function () {
        console.log('drop');
        res.end();
      }, 5 * 1000);
    }
    else {
      console.log('connected');
      // send missed changes
      var lastId = req.headers['Last-Event-ID'];
      if (lastId) {
        console.log('sending docs since', lastId);
        sendDocsSince(res, lastId);
      }

      // push this res object to our global variable
      openConnections.push(res);

      // When the request is closed, e.g. the browser window
      // is closed. We search through the open connections
      // array and remove this connection.
      req.on("close", function() {
        openConnections = _.without(openConnections, res);
      });
    }
  });
};
