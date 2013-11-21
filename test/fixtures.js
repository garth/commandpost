var config = require('../server/config/config')('test');
var mongo = require('mongodb');
var fs = require('fs');
var RSVP = require('rsvp');

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
      promises.push(new RSVP.Promise(function (resolve, reject) {
        // drop the existing collection items
        var collection = db.collection(collectionName);
        collection.remove(function (err) {
          if (err) {
            reject(err);
          }
          else if (collectionItems.length) {
            // insert the collection fixture items
            collection.insert(collectionItems, function (err, result) {
              if (err) {
                reject(err);
              }
              else {
                resolve();
              }
            });
          }
          else {
            resolve();
          }
        });
      }));
    });

    // notify when all fixtures modifications are complete
    if (typeof callback === 'function') {
      RSVP.all(promises).then(function (results) {
        callback();
      });
    }
  });
};
