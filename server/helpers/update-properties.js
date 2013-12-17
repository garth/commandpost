var _ = require('underscore');

module.exports = function (target, source, properties) {
  var keys = _.keys(source);
  if (properties) {
    keys = _.intersection(keys, properties);
  }
  var oldValues = {};
  keys.forEach(function (property) {
    var targetProperty = target[property];
    if (targetProperty && targetProperty._bsontype === 'ObjectID') {
      targetProperty = '' + targetProperty;
    }
    if (targetProperty !== source[property]) {
      oldValues[property] = target[property];
      target[property] = source[property];
    }
  });
  return oldValues;
};
