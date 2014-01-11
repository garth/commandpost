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
  app.pubsub.publishError = function (serverType, clientType, error) {
    if (!error) {
      error = clientType;
      clientType = serverType;
    }
    else {
      app.pubsub.publish('/error/' + serverType, error);
    }
    if (error && error.context && error.context.ext && error.context.ext.clientId) {
      app.pubsub.publish('/private/' + error.context.ext.clientId + '/error/' + clientType, {
        code: error.code,
        message: error.message,
        context: error.context
      });
    }
  };

  // publish to client helper
  app.pubsub.publishToClient = function (channel, message, context) {
    if (context && context.ext && context.ext.clientId) {
      app.pubsub.publish('/private/' + context.ext.clientId + channel, message);
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
