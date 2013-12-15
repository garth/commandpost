var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function (parent, childrenPropertyKey, childType, parentPropertyKey, next) {
  var Model = mongoose.model(childType);
  var filter = {};
  filter[parentPropertyKey] = parent;
  Model.find(filter, function (err, children) {
    if (err) { return next(err); }
    parent[childrenPropertyKey] = _.map(children, function (child) {
      return child.id;
    });
    next();
  });
};
