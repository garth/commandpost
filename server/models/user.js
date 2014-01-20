var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');

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
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], require: true, 'default': 'user' }
  }, config.schemaOptions);

  // hash the password before saving
  User.pre('save', function (next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) { return next(); }

    // replace the cleartext password with the hashed one
    this.password = passwordHash.generate(this.password);

    next();
  });

  User.methods.checkPassword = function (password) {
    return passwordHash.verify(password, this.password);
  };

  // register user with mongoose
  mongoose.model('User', User);
};
