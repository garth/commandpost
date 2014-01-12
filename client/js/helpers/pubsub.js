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
    message.data.clientChannelId = clientChannelId;
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

App.pubsub.on('transport:down', function() {
  App.flash.error('Failed to connect to server');
});

App.pubsub.on('transport:up', function() {
  App.flash.success('Connected to server');
});

// App.pubsub.subscribe('/board/**', function (message) {
//   console.log(message);
// });
