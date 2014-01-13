App.pubsub = new window.Faye.Client('/pubsub', {
  timeout: 50,
  retry: 5
});

var clientChannelId = App.createUuid();

App.pubsub.addExtension({
  outgoing: function (message, callback) {
    message.ext = message.ext || {};
    message.ext.sessionId = localStorage.sessionId;
    message.data = message.data || {};
    message.data.meta = message.data.meta || {};
    message.data.meta.clientChannelId = clientChannelId;
    callback(message);
  }
});

App.pubsub.subscribeToClient = function (channel, callback) {
  return App.pubsub.subscribe('/private/' + clientChannelId + channel, callback);
};

App.pubsub.subscribe('/private/' + clientChannelId + '/error/**', function (message) {
  App.flash.error(message.message || 'Unknown error');
  console.log('Error', message);
});

App.pubsub.publishAwait = function (channel, message, formatResponse) {
  if (typeof message === 'function' && !formatResponse) {
    formatResponse = message;
    message = {};
  }
  return new Ember.RSVP.Promise(function (resolve, reject) {
    var subscriptionGet, subscriptionError, timeout;

    var done = function (message, failed) {
      clearTimeout(timeout);
      subscriptionGet.cancel();
      subscriptionError.cancel();
      if (!failed) {
        resolve(message);
      }
      else {
        reject(message);
      }
    };

    timeout = setTimeout(function () {
      App.flash.error('Request timed out');
      done({ error: 'Request timed out' }, true);
    }, 10 * 1000);

    subscriptionGet = App.pubsub.subscribeToClient(channel, function (message) {
      if (typeof formatResponse === 'function') {
        done(formatResponse(message));
      }
      else {
        done(message);
      }
    });

    subscriptionError = App.pubsub.subscribeToClient('/error' + channel, function (message) {
      console.log('/error' + channel, message);
      done(message, true);
    });

    App.pubsub.publish('/server' + channel, message || {});
  });
};

App.pubsub.on('transport:down', function() {
  App.flash.error('Failed to connect to server');
  App.set('isConnected', false);
});

App.pubsub.on('transport:up', function() {
  if (!App.get('isConnected')) {
    App.set('isConnected', true);
    App.flash.success('Connected to server');
  }
});
