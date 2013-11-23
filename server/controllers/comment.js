var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/comments', authorise, function (req, res, next) {
    Comment.find(req.params || {}, function (err, comments) {
      if (err) { return next(err); }
      res.send({ comments: comments });
    });
  });

  app.post('/api/comments', authorise, function (req, res, next) {
    (new Comment(req.body.comment)).save(function (err, comment) {
      if (err) { return next(err); }
      res.send({ comment: comment.toJSON() });
    });
  });

  app.get('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
      if (err) { return next(err); }
      res.send({ comment: comment });
    });
  });

  app.put('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
      if (err) { return next(err); }
      res.end();
    });
  });

  app.del('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findByIdAndRemove(req.params.id, function(err, comment) {
      if (err) { return next(err); }
      res.end();
    });
  });
};
