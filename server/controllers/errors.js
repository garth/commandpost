module.exports = function (app, config, db) {

  app.use(function(err, req, res, next) {
    var message = { errorCode: 500, message: 'Unexpected error', details: err };
    console.log('error', message);
    res.send(500, message);
  });

  app.pubsub.subscribe('/error/**', function (message) {
    if (message.errorCode > 500) {
      console.log('error', message);
    }
  });

};
