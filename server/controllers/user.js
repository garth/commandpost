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
    User.find({}, function (err, users) {
      if (err) {
        return app.pubsub.publishError('/users/create', '/users/create', {
          message: 'Failed to lookup users',
          details: err,
          context: message
        });
      }

      // first user gets admin permission
      message.user.role = users.length === 0 ? 'admin' : 'user';

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
        message.meta.user = user;
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
  });

  app.pubsub.subscribe('/server/users/update', function (message) {
    // check the user permissions
    var role = message.meta.user.role;
    if (role !== 'admin' || message.meta.user.id !== message.user.id) {
      return app.pubsub.publishError('/users/update', '/users/update', {
        errorCode: 403,
        message: 'Not authorised',
        context: message
      });
    }

    User.findById(message.user.id, function (err, user) {
      if (err || !user) {
        return app.pubsub.publishError('/users/update', '/users/update', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get user' : 'User not found',
          details: err,
          context: message
        });
      }

      // update the user
      var properties = ['name', 'initials'];
      if (message.meta.user.role === 'admin' && message.meta.user.id !== message.user.id) {
        // admins can update a users role (but not their own role)
        properties.push('role');
      }
      var oldValues = updateProperties(user, message.user, properties);

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
