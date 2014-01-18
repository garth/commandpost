var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var updateProperties = require('../helpers/update').properties;

module.exports = function (app, config, db) {

  var recordHistory = require('../helpers/history')(app.pubsub);

  app.pubsub.subscribe('/server/users', function (message) {
    User.find({}, function (err, users) {
      if (err) {
        return app.pubsub.publishError('/users', '/users', {
          message: 'Failed to get users',
          details: err,
          context: message
        });
      }
      var userList = _.map(users, function (user) {
        return user.toJSON();
      });
      app.pubsub.publishToClient('/users', { users: userList }, message);
    });
  });

  app.pubsub.subscribe('/server/users/create', function (message) {
    // create the user
    (new User(message.user)).save(function (err, user) {
      if (err) {
        return app.pubsub.publishError('/users/create', '/users/create', {
          message: 'Failed to create user',
          details: err,
          context: message
        });
      }
      user = user.toJSON();
      message.meta.userId = user.id;
      recordHistory(message, 'user', 'create', user);

      // notify the client
      app.pubsub.publishToClient('/users/create', {
        user: user
      }, message);

      // notify all subscribers
      app.pubsub.publish('/users', {
        action: 'create',
        user: user
      });
    });
  });

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
};
