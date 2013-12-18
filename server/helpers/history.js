var mongoose = require('mongoose');
var History = mongoose.model('History');

var notify = null;

exports.record = function (user, type, action, document, previousValues) {
  var data = {
    user: user.id,
    date: Date.now(),
    action: action,
    documentType: type,
    document: document
  };
  if (previousValues) {
    data.previousValues = previousValues;
  }
  (new History(data)).save(function (err, doc) {
    if (!err && typeof notify === 'function') {
      notify(doc.toJSON());
    }
  });
};

exports.notify = function (eventHandler) {
  notify = eventHandler;
};
