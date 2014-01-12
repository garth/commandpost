var faye = require('faye');

module.exports = function (app, config, db) {

  // setup faye pub sub
  app.bayeux = new faye.NodeAdapter({
    mount: '/pubsub',
    timeout: 45
  });
  app.bayeux.attach(app.server);
  app.pubsub = app.bayeux.getClient();

  // publish error helper
  app.pubsub.publishError = function (serverChannel, clientChannel, error) {
    if (!error) {
      error = clientChannel;
      clientChannel = serverChannel;
    }
    else {
      app.pubsub.publish('/error/' + serverChannel, error);
    }
    var clientChannelId = error && error.context && error.context.clientChannelId;
    if (clientChannelId) {
      app.pubsub.publish('/private/' + clientChannelId + '/error/' + clientChannel, {
        code: error.code,
        message: error.message,
        context: error.context
      });
    }
  };

  // publish to client helper
  app.pubsub.publishToClient = function (channel, message, context) {
    var clientChannelId = context && context.clientChannelId;
    if (clientChannelId) {
      app.pubsub.publish('/private/' + clientChannelId + channel, message);
    }
  };

  // app.bayeux.on('handshake', function (clientId) {
  //   console.log('handshake', clientId);
  // });
  // app.bayeux.on('subscribe', function (clientId, channel) {
  //   console.log('subscribe', clientId, channel);
  // });
  // app.bayeux.on('publish', function (clientId, channel, data) {
  //   console.log('publish', clientId, channel, data);
  // });

};
