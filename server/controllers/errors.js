module.exports = function (app, config, db) {

  app.use(function(err, req, res, next) {

    // default error
    var data = { error: 'Unexpected error' };
    var status = 500;

    // check for db errors
    if (err.name === 'MongoError') {
      var code = err.code || err.lastErrorObject.code;
      switch (code) {
      case 11000:
        status = 409;
        data.error = 'Attempting to add duplicate';
        break;
      case 11001:
        status = 409;
        data.error = 'Value is in use';
        break;
      default:
        console.log(err);
        data.dbCode = err.code;
        data.error = 'Unexpected database error';
      }
    }
    else {
      console.log(err);
    }

    // report the error
    res.send(status, data);
  });

  app.pubsub.subscribe('/error/**', function (message) {
    console.log('error', message);
  });

};
