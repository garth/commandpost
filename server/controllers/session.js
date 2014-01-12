var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');

module.exports = function (app, config, db) {

  app.pubsub.subscribe('/server/session/get', function (message) {
    User.findById(message.ext && message.ext.userId, function (err, user) {
      if (err) {
        return app.publishError('session', 'server', {
          code: 500,
          message: 'Failed to lookup user',
          details: err,
          context: message
        });
      }
      if (!user) {
        return app.pubsub.publishError('session', {
          code: 404,
          message: 'User not found',
          context: message
        });
      }
    });
  });

  app.pubsub.subscribe('/server/session/create', function (message) {
    User.findOne({ name: message.name }, function (err, user) {
      if (err) {
        return app.publishError('session', 'server', {
          code: 500,
          message: 'Failed to lookup user',
          details: err,
          context: message
        });
      }
      if (!user || !user.checkPassword(message.password)) {
        return app.pubsub.publishError('session', {
          code: 401,
          message: 'Incorrect name or password',
          context: message
        });
      }
      else {
        (new Session({ userId: user.id })).save(function (err, session) {
          if (err) {
            return app.pubsub.publishError('session', 'server', {
              code: 500,
              message: 'Failed to create session',
              details: err,
              context: message
            });
          }
          app.pubsub.publishToClient('/session/create', {
            newSessionId: session.id,
            user: user.toJSON()
          }, message);
        });
      }
    });
  });

  app.pubsub.subscribe('/server/session/destroy', function (message) {
    Session.findByIdAndRemove(message.ext && message.ext.sessionId, function (err, session) {
      if (err) {
        return app.publishError('session', 'server', {
          code: 500,
          message: 'Failed to destroy session',
          details: err,
          context: message
        });
      }
      app.pubsub.publishToClient('/session/destroy', {});
    });
  });
};
