var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');

module.exports = function (app, config, db) {

  app.pubsub.subscribe('/server/session/get', function (message) {
    User.findById(message.meta && message.meta.userId, function (err, user) {
      if (err || !user) {
        return app.pubsub.publishError('/session/get', '/session/get', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to lookup user' : 'User not found',
          details: err,
          context: message
        });
      }
      app.pubsub.publishToClient('/session/get', {
        user: user.toJSON()
      }, message);
    });
  });

  app.pubsub.subscribe('/server/session/create', function (message) {
    User.findOne({ login: message.name.toLowerCase() }, function (err, user) {
      if (err || !user || !user.checkPassword(message.password)) {
        return app.pubsub.publishError('/session/create', '/session/create', {
          errorCode: err ? 500 : 401,
          message: err ? 'Failed to lookup user' : 'Incorrect login name or password',
          details: err,
          context: message
        });
      }
      (new Session({ userId: user.id })).save(function (err, session) {
        if (err) {
          return app.pubsub.publishError('/session/create', '/session/create', {
            message: 'Failed to create session',
            details: err,
            context: message
          });
        }
        app.pubsub.publishToClient('/session/create', {
          sessionId: session.id,
          user: user.toJSON()
        }, message);
      });
    });
  });

  app.pubsub.subscribe('/server/session/destroy', function (message) {
    Session.findByIdAndRemove(message.sessionId, function (err, session) {
      if (err || !session) {
        return app.pubsub.publishError('/session/destroy', '/session/destroy', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to destroy session' : 'Session not found',
          details: err,
          context: message
        });
      }
      app.pubsub.publishToClient('/session/destroy', {}, message);
    });
  });
};
