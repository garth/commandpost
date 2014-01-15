var mongoose = require('mongoose');
var User = mongoose.model('User');
var updateProperties = require('../helpers/update').properties;

module.exports = function (app, config, db) {

  var recordHistory = require('../helpers/history')(app.pubsub);

  // var authorise = require('../authorise')(config);

  // app.get('/api/users', authorise, function (req, res, next) {
  //   User.find(prepareQuery(req.query), function (err, users) {
  //     if (err) { return next(err); }
  //     res.send({ users: users });
  //   });
  // });

  app.pubsub.subscribe('/server/user/create', function (message) {
    // create the user
    (new User(message.user)).save(function (err, user) {
      if (err) {
        return app.publishError('/user', '/server', {
          message: 'Failed to create user',
          details: err,
          context: message
        });
      }
      user = user.toJSON();
      recordHistory(message, 'user', 'create', user);

      // notify the client
      app.pubsub.publishToClient('/user/create', {
        user: user
      }, message);

      // notify all subscribers
      app.pubsub.publish('/users', {
        action: 'create',
        user: user
      });
    });
  });

  // app.get('/api/users/:id', authorise, function (req, res, next) {
  //   User.findById(req.params.id, function (err, user) {
  //     if (err) { return next(err); }
  //     res.send(user ? { user: user } : 404);
  //   });
  // });

  // app.put('/api/users/:id', authorise, function (req, res, next) {
  //   User.findById(req.params.id, function (err, user) {
  //     if (err) { return next(err); }
  //     var oldValues = updateProperties('user', user, req.body.user, ['name', 'password']);
  //     recordHistory(req.user, 'user', 'update', user.toJSON(), oldValues);
  //     user.save(function (err, user) {
  //       if (err) { return next(err); }
  //       res.send({});
  //     });
  //   });
  // });

  // app.del('/api/users/:id', authorise, function (req, res, next) {
  //   User.findById(req.params.id, function (err, user) {
  //     if (err) { return next(err); }
  //     recordHistory(req.user, 'user', 'delete', user.toJSON());
  //     user.remove(function (err) {
  //       if (err) { return next(err); }
  //       res.send({});
  //     });
  //   });
  // });
};
