var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  var expires = function () {
    return new Date(new Date().getTime() + config.sessionTtl);
  };

  // define session
  var Session = new Schema({
    userId: { type: ObjectId, required: true },
    expiresOn: { type: Date, 'default': expires, required: true }
  }, config.schemaOptions);

  // extend the session by 2 weeks
  Session.methods.extend = function (callback) {
    this.expiresOn = expires();
    this.save(callback);
  };

  // register session with mongoose
  mongoose.model('Session', Session);
};
