var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var Lane = mongoose.model('Lane');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/boards', authorise, function (req, res, next) {
    Board.find(prepareQuery(req.query), function (err, boards) {
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
        board = board.toJSON();
        board.lanes = [ lane1.id, lane2.id, lane3.id ];
        recordHistory(req.user, 'board', 'create', board);
        recordHistory(req.user, 'lane', 'create', lane1.toJSON());
        recordHistory(req.user, 'lane', 'create', lane2.toJSON());
        recordHistory(req.user, 'lane', 'create', lane3.toJSON());
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
    Board.findById(req.params.id, function (err, board) {
      if (err) { return next(err); }
      var oldValues = updateProperties(board, req.body.board, ['name']);
      recordHistory(req.user, 'board', 'update', board.toJSON(), oldValues);
      board.save(function (err, board) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });

  app.del('/api/boards/:id', authorise, function (req, res, next) {
    Board.findById(req.params.id, function (err, board) {
      if (err) { return next(err); }
      recordHistory(req.user, 'board', 'delete', board.toJSON());
      board.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
