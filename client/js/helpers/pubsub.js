App.pubsub = new window.Faye.Client('/pubsub', {
  timeout: 50,
  retry: 5
});

var clientId = App.createUuid();

App.pubsub.addExtension({
  outgoing: function (message, callback) {
    message.ext = message.ext || {};
    message.ext.sessionId = localStorage.sessionId;
    message.ext.clientId = clientId;
    callback(message);
  }
});

App.pubsub.subscribe('/private/' + clientId + '/error/**', function (message) {
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
