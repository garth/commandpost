var Faye = require('faye');
var RSVP = require('rsvp');
var uuid = require('node-uuid');
var pubsub = require('../client/js/helpers/pubsub');

module.exports = function (sessionId) {
  return pubsub(null, Faye, RSVP, 'http://localhost:3001/pubsub',
    uuid.v1(), { sessionId: sessionId });
};
