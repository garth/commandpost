module.exports = function (App, Faye, RSVP, endPoint, clientChannelId, localStorage) {

  var pubsub = new Faye.Client(endPoint, {
    timeout: 50,
    retry: 5
  });

  pubsub.addExtension({
    outgoing: function (message, callback) {
      message.ext = message.ext || {};
      message.ext.sessionId = localStorage.sessionId;
      message.data = message.data || {};
      message.data.meta = message.data.meta || {};
      message.data.meta.clientChannelId = clientChannelId;
      callback(message);
    }
  });

  pubsub.subscribeToClient = function (channel, callback) {
    return pubsub.subscribe('/private/' + clientChannelId + channel, callback);
  };

  if (App && App.flash) {
    pubsub.subscribeToClient('/error/**', function (message) {
      App.flash.error(message.message || 'Unknown error');
      console.log('Error', message);
    });
  }

  pubsub.publishAwait = function (channel, message, formatResponse) {
    if (typeof message === 'function' && !formatResponse) {
      formatResponse = message;
      message = {};
    }
    return new RSVP.Promise(function (resolve, reject) {
      var subscriptionGet, subscriptionError, timeout;

      var done = function (message, failed) {
        clearTimeout(timeout);
        subscriptionGet.cancel();
        subscriptionError.cancel();
        if (!failed) {
          resolve(message);
        }
        else {
          var error = new Error(message.message || 'Unexpected Error');
          error.data = message;
          reject(error);
        }
      };

      timeout = setTimeout(function () {
        if (App && App.flash) {
          App.flash.error('Request timed out');
        }
        done({ message: 'Request timed out' }, true);
      }, 10 * 1000);

      subscriptionGet = pubsub.subscribeToClient(channel, function (message) {
        if (typeof formatResponse === 'function') {
          done(formatResponse(message));
        }
        else {
          done(message);
        }
      });

      subscriptionError = pubsub.subscribeToClient('/error' + channel, function (message) {
        if (App) {
          console.log('/error' + channel, message);
        }
        done(message, true);
      });

      pubsub.publish('/server' + channel, message || {});
    });
  };

  if (App && App.flash) {
    pubsub.on('transport:down', function() {
      App.flash.error('Failed to connect to server');
      App.set('isConnected', false);
    });

    pubsub.on('transport:up', function() {
      if (!App.get('isConnected')) {
        App.set('isConnected', true);
        App.flash.success('Connected to server');
      }
    });
  }

  return pubsub;
};
