var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var crypto = require('crypto');

var serverSecret = crypto.randomBytes(256).toString();

module.exports = function (app, config, db) {

  app.publishError = function (serverType, clientType, error) {
    if (!error) {
      error = clientType;
      clientType = serverType;
    }
    else {
      app.pubsub.publish('/error/' + serverType, error);
    }
    if (error.context && error.context.ext && error.context.ext.clientId) {
      app.pubsub.publish('/private/' + error.context.ext.clientId + '/error/' + clientType, {
        code: error.code,
        message: error.message,
        context: error.context
      });
    }
  };

  app.pubsub.addExtension({
    // all server sent messages are authorised with serverSecret
    outgoing: function (message, callback) {
      message.ext = message.ext || {};
      message.ext.sessionId = serverSecret;
    }
  });

  app.bayeux.addExtension({
    // verify incomming messages
    incoming: function (message, callback) {

      // all subscriptions (except /private/ channels) need to be pre-authorised
      if ((message.channel === '/meta/subscribe' &&
        !message.subscription.match(/^\/private\//)) ||
        // all messages (except /meta/ and /server/session need to be pre-authorised
        !message.channel.match(/^\/(meta|server\/session)\//)) {

        // session is required
        var sessionId = message.ext && message.ext.sessionId;
        if (!sessionId) {
          message.error = '401::Authentication required';
          return callback(message);
        }
        // check all sessions except server session
        if (sessionId !== serverSecret) {

          // if this is a subscription, check if clients are allowed to subscibe to this channel
          if (message.channel === '/meta/subscribe' &&
            message.subscription.match(/^\/(\*|server)/)) {
            message.error = '403::Not authorised';
            return callback(message);
          }

          // check the session
          Session.findById(sessionId, function (err, session) {
            var errorMessage;
            if (err) {
              errorMessage = 'Failed to lookup session';
              message.error = '500::' + errorMessage;
              app.publishError('session', 'server', {
                code: 500,
                message: errorMessage,
                details: err,
                context: message
              });
            }
            // check if session is not found or has expired
            else if (!session || session.expiresOn < Date.now()) {
              errorMessage = 'Session has expired';
              message.error = '401::' + errorMessage;
              app.publishError('session', {
                code: 401,
                message: errorMessage,
                context: message
              });
            }
            else {
              // accept this request
              message.ext.userId = session.userId;

              // extend the session once per day
              var ttl = new Date(new Date().getTime() + config.sessionTtl - 1000 * 60 * 60 * 24);
              if (session.expiresOn < ttl) {
                session.extend(function (err, session) {
                  app.publishError('session', 'server', {
                    code: 500,
                    message: 'Failed to extend session',
                    details: err,
                    context: message
                  });
                });
              }
            }
            callback(message);
          });
        }
      }
      else {
        // authorisation not required
        callback(message);
      }
    },

    outgoing: function (message, callback) {
      if (message.ext) {
        // ensure that outgoing messages don't have the session id attached
        delete message.ext.sessionId;
        // if message is not directed to the server, remove the client id
        if (!message.channel.match(/^\/server\//)) {
          delete message.ext.clientId;
        }
      }
      callback(message);
    }
  });

};
