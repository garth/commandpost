var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/comments', authorise, function (req, res, next) {
    Comment.find(req.query || {}, function (err, comments) {
      if (err) { return next(err); }
      res.send({ comments: comments });
    });
  });

  app.post('/api/comments', authorise, function (req, res, next) {
    var comment = req.body.comment;
    comment.user = req.user.id;
    (new Comment(req.body.comment)).save(function (err, comment) {
      if (err) { return next(err); }
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
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
      if (err) { return next(err); }
      res.send({});
    });
  });

  app.del('/api/comments/:id', authorise, function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
      if (err) { return next(err); }
      comment.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
