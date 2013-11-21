var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');
var User = mongoose.model('User');

// setup authentication
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
  },
  function(name, password, done) {
    User.findOne({ name: name }, function (err, user) {
      if (err) { return done(err); }
      if (!user || !user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect name or password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) { done(err); }
    done(null, user);
  });
});

module.exports = function (app, config, db) {
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
};
