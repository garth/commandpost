var _ = require('underscore');

var getChildren = function (container, doc, collections) {
  if (_.isArray(doc)) {
    var docs = [];
    doc.forEach(function (doc) {
      docs.push(getChildren(container, doc, collections));
    });
    return docs;
  }
  else {
    if (doc.toJSON) {
      doc = doc.toJSON();
    }
    collections.forEach(function (key) {
      var children = doc['_' + key];
      //console.log(key, children, doc[key], doc);
      if (children && doc[key]) {
        container[key] = _.union(container[key] || [], children);
        delete doc['_' + key];
        getChildren(container, children, collections);
      }
    });
    return doc;
  }
};

module.exports = function (key, doc, collections) {
  var container = {};
  container[key] = getChildren(container, doc, collections);
  return container;
};
