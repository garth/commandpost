module.exports = function (app, config, db) {
  if (!config.isProduction) {

    var fs = require('fs');
    var path = require('path');

    app.get('/test', function (req, res, next) {
      fs.readdir(path.join(config.root, 'test/client'), function (err, files) {
        if (err) { return next(err); }
        res.render('test', {
          files: files
        });
      });
    });

  }

  if (config.isTest) {
    app.post('/test/reset-fixtures', function (req, res, next) {
      require('../../test/fixtures')(function () {
        res.end();
      });
    });
  }
};
