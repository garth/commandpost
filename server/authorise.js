var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var User = mongoose.model('User');
var crypto = require('crypto');

var serverSecret = crypto.randomBytes(256).toString();

module.exports = function (app, config, db) {

  app.pubsub.addExtension({
    // all server sent messages are authorised with serverSecret
    outgoing: function (message, callback) {
      message.ext = message.ext || {};
      message.ext.sessionId = serverSecret;
      callback(message);
    }
  });

  app.bayeux.addExtension({
    // verify incomming messages
    incoming: function (message, callback) {
      var errorMessage;

      // all subscriptions (except /private/ channels) need to be pre-authorised
      if ((message.channel === '/meta/subscribe' &&
        !message.subscription.match(/^\/private\//)) ||
        // all messages (except /meta/, /server/session/create and
        // /server/user/create need to be pre-authorised
        !message.channel.match(/^\/(meta|server\/session\/create|server\/users\/create)/)) {

        // session is required
        var sessionId = message.ext && message.ext.sessionId;
        if (!sessionId) {
          errorMessage = 'Authentication required';
          message.error = '401::' + errorMessage;
          app.pubsub.publishError('/session', {
            errorCode: 401,
            message: errorMessage,
            context: message.data
          });
          callback(message);
        }
        else  if (sessionId === serverSecret) {
          callback(message);
        }
        else {

          // if this is a subscription, check if clients are allowed to subscibe to this channel
          if (message.channel === '/meta/subscribe' &&
            message.subscription.match(/^\/(\*|server)/)) {
            errorMessage = 'Not authorised';
            message.error = '403::' + errorMessage;
            app.pubsub.publishError('/session', {
              errorCode: 403,
              message: errorMessage,
              context: message.data
            });
            return callback(message);
          }

          // check the session
          Session.findById(sessionId, function (err, session) {
            if (err) {
              errorMessage = 'Failed to lookup session';
              message.error = '500::' + errorMessage;
              app.pubsub.publishError('/session', '/server', {
                message: errorMessage,
                details: err,
                context: message.data
              });
              callback(message);
            }
            // check if session is not found or has expired
            else if (!session || session.expiresOn < Date.now()) {
              errorMessage = 'Session has expired';
              message.error = '401::' + errorMessage;
              app.pubsub.publishError('/session', {
                errorCode: 401,
                message: errorMessage,
                context: message.data
              });
              callback(message);
            }
            else {
              // accept this request
              message.data = message.data || {};
              message.data.meta = message.data.meta || {};

              // append the user doc to the message.data
              User.findById(session.userId, function (err, user) {
                if (err || !user) {
                  errorMessage = 'Failed to lookup user';
                  message.error = (err ? 500 : 404) +'::' + errorMessage;
                  app.pubsub.publishError('/session', '/server', {
                    errorCode: err ? 500 : 404,
                    message: errorMessage,
                    details: err,
                    context: message.data
                  });
                }
                else {
                  message.data.meta.user = user.toJSON();

                  // extend the session once per day
                  var ttl = new Date(
                    new Date().getTime() + config.sessionTtl - 1000 * 60 * 60 * 24);
                  if (session.expiresOn < ttl) {
                    session.extend(function (err, session) {
                      app.pubsub.publishError('/session', '/server', {
                        message: 'Failed to extend session',
                        details: err,
                        context: message.data
                      });
                    });
                  }

                }
                callback(message);
              });
            }
          });
        }
      }
      else {
        // authorisation not required
        callback(message);
      }
    },

    outgoing: function (message, callback) {
      // if message is not directed to the server, remove the client and session id
      if (!message.channel.match(/^\/server\//)) {
        if (message.ext) {
          delete message.ext.sessionId;
        }
        if (message.data && message.data.meta) {
          delete message.data.meta.clientChannelId;
        }
      }
      callback(message);
    }
  });

};
