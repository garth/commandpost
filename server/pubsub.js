var faye = require('faye');

var setErrorCode = function (err) {
  // check for db errors
  if (err.details && err.details.name === 'MongoError') {
    var code = err.details.code || err.details.lastErrorObject.code;
    switch (code) {
    case 11000:
      err.errorCode = 409;
      err.message = err.message + ', attempting to add duplicate';
      break;
    case 11001:
      err.errorCode = 409;
      err.message = err.message + ', value is in use';
      break;
    default:
      console.log(err);
      err.dbCode = code;
      err.errorCode = err.errorCode || 500;
      err.message = err.message + ', Unexpected database error';
    }
  }
  else {
    err.errorCode = err.errorCode || 500;
  }
};

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
      setErrorCode(error);
    }
    else {
      setErrorCode(error);
      // notify server
      app.pubsub.publish('/error' + serverChannel, error);
    }
    // notifiy client
    app.pubsub.publishToClient('/error' + clientChannel, {
      errorCode: error.errorCode || 500,
      message: error.message,
      context: error.context
    }, error.context);
  };

  // publish to client helper
  app.pubsub.publishToClient = function (channel, message, context) {
    var clientChannelId = context && context.meta && context.meta.clientChannelId;
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
  // app.bayeux.on('unsubscribe', function (clientId, channel) {
  //   console.log('unsubscribe', clientId, channel);
  // });
  // app.bayeux.on('publish', function (clientId, channel, data) {
  //   console.log('publish', clientId, channel, data);
  // });

};
