var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/comments', authorise, function (req, res, next) {
    Comment.find(prepareQuery(req.query), function (err, comments) {
      if (err) { return next(err); }
      res.send({ comments: comments });
    });
  });

  app.post('/api/comments', authorise, function (req, res, next) {
    var comment = req.body.comment;
    comment.user = req.user.id;
    (new Comment(comment)).save(function (err, comment) {
      if (err) { return next(err); }
      recordHistory(req.user, 'comment', 'create', comment.toJSON());
      res.send({ comment: comment });
    });
  });

  app.get('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
      if (err) { return next(err); }
      res.send(comment ? { comment: comment } : 404);
    });
  });

  app.put('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
      if (err) { return next(err); }
      var oldValues = updateProperties(comment, req.body.comment, ['text']);
      recordHistory(req.user, 'comment', 'update', comment.toJSON(), oldValues);
      comment.save(function (err, comment) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });

  app.del('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
      if (err) { return next(err); }
      recordHistory(req.user, 'comment', 'delete', comment.toJSON());
      comment.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
