var mongoose = require('mongoose');
var History = mongoose.model('History');

module.exports = function (pubsub) {
  return function (message, type, action, document, previousValues) {
    var history = {
      userId: message.meta.userId,
      action: action,
      documentType: type,
      document: document
    };
    if (previousValues) {
      history.previousValues = previousValues;
    }
    (new History(history)).save(function (err, history) {
      if (err) {
        return pubsub.publishError('/history', '/history', {
          message: 'Failed save history',
          details: err,
          context: message
        });
      }
    });
  };
};
