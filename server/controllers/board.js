var mongoose = require('mongoose');
var Board = mongoose.model('Board');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/boards', authorise, function (req, res, next) {
    Board.find(req.query || {}, function (err, boards) {
      if (err) { return next(err); }
      res.send({ boards: boards });
    });
  });

  app.post('/api/boards', authorise, function (req, res, next) {
    var board = req.body.board;
    board.createdByUser = req.user.id;
    board.createdOn = Date.now();
    (new Board(board)).save(function (err, board) {
      if (err) { return next(err); }
      res.send({ board: board.toJSON() });
    });
  });

  app.get('/api/boards/:id', authorise, function (req, res, next) {
    Board.findById(req.params.id, function (err, board) {
      if (err) { return next(err); }
      res.send({ board: board });
    });
  });

  app.put('/api/boards/:id', authorise, function (req, res, next) {
    Board.findByIdAndUpdate(req.params.id, req.body.board, function(err, board) {
      if (err) { return next(err); }
      res.send({});
    });
  });

  app.del('/api/boards/:id', authorise, function (req, res, next) {
    Board.findByIdAndRemove(req.params.id, function(err, board) {
      if (err) { return next(err); }
      res.send({});
    });
  });
};
