var config = require('../server/config/config')('test');
var mongo = require('mongodb');
var fs = require('fs');
var RSVP = require('rsvp');
var Promise = RSVP.Promise;

//initialise all fixtures
module.exports = function (callback) {
  // connect to mongo
  mongo.Db.connect(config.db, function (err, db) {
    var promises = [];
    // iterate over each fixture collection
    fs.readdirSync(__dirname + '/fixtures').forEach(function (fixtureFile) {
      // get the fixture data
      var collectionName = fixtureFile.replace(/\.js/, '');
      var collectionItems = require(__dirname + '/fixtures/' + fixtureFile);
      // do the work inside a promise
      promises.push(new Promise(function (resolve, reject) {
        // drop the existing collection items
        var collection = db.collection(collectionName);
        collection.remove(function (err) {
          if (err) {
            return reject(err);
          }
          if (collectionItems.length) {
            // insert the collection fixture items
            collection.insert(collectionItems, function (err, result) {
              err ? reject(err) : resolve();
            });
          }
          else {
            resolve();
          }
        });
      }));
    });

    RSVP.all(promises).then(function (results) {
      db.close();
      if (typeof callback === 'function') {
        // notify when all fixtures modifications are complete
        callback();
      }
    });
  });
};
