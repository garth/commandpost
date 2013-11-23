var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

module.exports = function(config) {

  // connect to the database
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', function (error) {
    console.log(error);
    throw new Error('unable to connect to database at ' + config.db);
  });

  // load the models
  var modelsPath = path.join(config.root, 'server/models');
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.match(/\.js/)) {
      require(path.join(modelsPath, file))(config, db);
    }
  });

  return db;
};
