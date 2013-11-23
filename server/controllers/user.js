var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app, config, db) {

  app.get('/api/users', function (req, res, next) {
    User.find(req.params || {}, function (err, users) {
      if (err) { return next(err); }
      res.send({ users: users });
    });
  });

  app.post('/api/users', function (req, res, next) {
    (new User(req.body.user)).save(function (err, user) {
      if (err) { return next(err); }
      res.send({ user: user });
    });
  });

  app.get('/api/users/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
      if (err) { return next(err); }
      res.send({ user: user });
    });
  });

  app.put('/api/users/:id', function (req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user) {
      if (err) { return next(err); }
      res.end();
    });
  });

  app.del('/api/users/:id', function (req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) { return next(err); }
      res.end();
    });
  });
};
