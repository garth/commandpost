var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var Lane = mongoose.model('Lane');

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
      Lane.create([
        { board: board, name: 'Backlog', order: 0 },
        { board: board, name: 'In Progress', order: 1 },
        { board: board, name: 'Done', order: 2 }
      ], function (err, lane1, lane2, lane3) {
        if (err) { return next(err); }
        board.lanes = [ lane1.id, lane2.id, lane3.id ];
        res.send({ board: board });
      });
    });
  });

  app.get('/api/boards/:id', authorise, function (req, res, next) {
    Board.findById(req.params.id, function (err, board) {
      if (err) { return next(err); }
      res.send(board ? { board: board } : 404);
    });
  });

  app.put('/api/boards/:id', authorise, function (req, res, next) {
    Board.findByIdAndUpdate(req.params.id, req.body.board, function(err, board) {
      if (err) { return next(err); }
      res.send({});
    });
  });

  app.del('/api/boards/:id', authorise, function (req, res, next) {
    Board.findById(req.params.id, function (err, board) {
      if (err) { return next(err); }
      board.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
