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

  app.pubsub.subscribe('/server/users/update', function (message) {
    User.findById(message.user.id, function (err, user) {
      if (err || !user) {
        return app.pubsub.publishError('/users/update', '/users/update', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get user' : 'User not found',
          details: err,
          context: message
        });
      }

      // find and update update the card
      var oldValues = updateProperties(user, message.user, ['name', 'initials']);

      // save the changes
      user.save(function (err, user) {
        if (err) {
          return app.pubsub.publishError('/users/update', '/users/update', {
            message: 'Failed to update user',
            details: err,
            context: message
          });
        }
        user = user.toJSON();
        recordHistory(message, 'user', 'update', user, oldValues);

        // notify the client
        app.pubsub.publishToClient('/users/update', {}, message);

        // notify all subscribers
        app.pubsub.publish('/users', {
          action: 'update',
          user: user
        });
      });
    });
  });
};
