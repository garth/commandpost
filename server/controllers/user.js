var mongoose = require('mongoose');
var User = mongoose.model('User');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  // var authorise = require('../authorise')(config);

  // app.get('/api/users', authorise, function (req, res, next) {
  //   User.find(prepareQuery(req.query), function (err, users) {
  //     if (err) { return next(err); }
  //     res.send({ users: users });
  //   });
  // });

  app.pubsub.subscribe('/server/user/create', function (message) {
    (new User(message.user)).save(function (err, user) {
      if (err) {
        return app.publishError('/user', '/server', {
          message: 'Failed to create user',
          details: err,
          context: message
        });
      }
      //recordHistory(user, 'user', 'create', user.toJSON());
      app.pubsub.publishToClient('/user/create', {
        user: user.toJSON()
      }, message);
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
