var mongoose = require('mongoose');
var Session = mongoose.model('Session');
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

      // all subscriptions (except /private/ channels) need to be pre-authorised
      if ((message.channel === '/meta/subscribe' &&
        !message.subscription.match(/^\/private\//)) ||
        // all messages (except /meta/ and /server/session/create need to be pre-authorised
        !message.channel.match(/^\/(meta|server\/session\/create)/)) {

        // session is required
        var sessionId = message.ext && message.ext.sessionId;
        if (!sessionId) {
          message.error = '401::Authentication required';
          callback(message);
        }
        else  if (sessionId === serverSecret) {
          callback(message);
        }
        else {

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
              app.pubsub.publishError('/session', '/server', {
                message: errorMessage,
                details: err,
                context: message
              });
            }
            // check if session is not found or has expired
            else if (!session || session.expiresOn < Date.now()) {
              errorMessage = 'Session has expired';
              message.error = '401::' + errorMessage;
              app.pubsub.publishError('/session', {
                code: 401,
                message: errorMessage,
                context: message
              });
            }
            else {
              // accept this request
              message.data = message.data || {};
              message.data.meta = message.data.meta || {};
              message.data.meta.userId = session.userId;

              // extend the session once per day
              var ttl = new Date(new Date().getTime() + config.sessionTtl - 1000 * 60 * 60 * 24);
              if (session.expiresOn < ttl) {
                session.extend(function (err, session) {
                  app.pubsub.publishError('/session', '/server', {
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
