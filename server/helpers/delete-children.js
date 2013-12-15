var mongoose = require('mongoose');
var RSVP = require('rsvp');
var Promise = RSVP.Promise;

module.exports = function (parent, childType, parentPropertyKey, next) {
  var Model = mongoose.model(childType);
  var filter = {};
  filter[parentPropertyKey] = parent;
  Model.find(filter, function (err, children) {
    if (err) { return next(err); }
    var promises = [];
    children.forEach(function (child) {
      promises.push(new Promise(function (resolve, reject) {
        child.remove(function (err) {
          if (err) { return reject(err); }
          resolve();
        });
      }));
    });
    RSVP.all(promises).then(function () { next(); }, next);
  });
};
