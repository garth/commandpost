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
      // no server notification
      error = clientChannel;
      clientChannel = serverChannel;
    }
    else {
      // notify server
      app.pubsub.publish('/error' + serverChannel, error);
    }
    // notifiy client
    app.pubsub.publishToClient('/error' + clientChannel, {
      code: error.code || 500,
      message: error.message,
      context: error.context
    }, error.context);
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
