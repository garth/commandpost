var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');

module.exports = function (config, db) {

  // define user
  var User = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    password: { type: String, required: true }
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
