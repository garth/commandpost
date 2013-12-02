var mongoose = require('mongoose');
var User = mongoose.model('User');
var Session = mongoose.model('Session');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/sessions', authorise, function (req, res, next) {
    res.send({ user: req.user });
  });

  app.post('/api/sessions', function (req, res, next) {
    User.findOne({ name: req.body.user.name }, function (err, user) {
      if (err) { return next(err); }
      if (!user || !user.checkPassword(req.body.user.password)) {
        res.send(401, { message: 'Incorrect name or password.' });
      }
      else {
        (new Session({ user: user.id })).save(function (err, session) {
          if (err) { return next(err); }
          res.cookie('session', session.id, { maxAge: config.sessionTtl });
          res.send({ user: user });
        });
      }
    });
  });

  app.del('/api/sessions', authorise, function (req, res, next) {
    Session.findByIdAndRemove(req.cookies.session, function(err, session) {
      if (err) { return next(err); }
      res.clearCookie('session');
      res.end();
    });
  });

};
