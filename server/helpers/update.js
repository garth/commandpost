var _ = require('lodash');

var updateProperties = exports.properties = function (target, source, properties) {
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

exports.collection = function (target, source, properties, canDeleteCallback, idChangedCallback) {
  var targetDictionary = _.indexBy(target, function (obj) { return obj.id.toString(); });
  var sourceDictionary = _.indexBy(source, 'id');
  var targetIds = _.keys(targetDictionary);
  var sourceIds = _.keys(sourceDictionary);

  // remove deleted items
  var deleted = [];
  _.forEach(_.difference(targetIds, sourceIds), function (id) {
    if (typeof canDeleteCallback !== 'function' || canDeleteCallback(targetDictionary[id])) {
      deleted.push(targetDictionary[id].toJSON());
      target.pull(id);
    }
  });

  // add created items
  var created = [];
  _.forEach(_.difference(sourceIds, targetIds), function (id) {
    var newItem = target[target.push(sourceDictionary[id]) - 1].toJSON();
    created.push(newItem);
    if (typeof idChangedCallback === 'function') {
      idChangedCallback(id, newItem.id);
    }
  });

  // update existing items
  var updated = [];
  _.forEach(_.intersection(targetIds, sourceIds), function (id) {
    var oldValues = updateProperties(targetDictionary[id], sourceDictionary[id], properties);
    if (oldValues !== {}) {
      oldValues.id = id;
      updated.push(oldValues);
    }
  });

  return { deleted: deleted, created: created, updated: updated };
};
