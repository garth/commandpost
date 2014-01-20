var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function toLower (value) {
  return value.toLowerCase();
}

function toUpper (value) {
  return value.toUpperCase();
}

module.exports = function (config, db) {

  // define user
  var User = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    initials: { type: String, index: { unique: true, dropDups: true }, required: true,
      set: toUpper },
    login: { type: String, index: { unique: true, dropDups: true }, required: true,
      set: toLower },
    password: { type: String, required: true }
  }, config.schemaOptions);

  // register user with mongoose
  mongoose.model('User', User);
};
