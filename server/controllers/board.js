var _ = require('underscore');
var mongoose = require('mongoose');
var Board = mongoose.model('Board');

module.exports = function (app, config, db) {

  var recordHistory = require('../helpers/history')(app.pubsub);

  app.pubsub.subscribe('/server/boards', function (message) {
    Board.find({}, function (err, boards) {
      if (err) {
        return app.pubsub.publishError('/boards', '/boards', {
          message: 'Failed to get boards',
          details: err,
          context: message
        });
      }
      var boardList = [];
      boards.forEach(function (board) {
        boardList.push({
          id: board.id,
          name: board.name
        });
      });
      app.pubsub.publishToClient('/boards', { boards: boardList }, message);
    });
  });

  app.pubsub.subscribe('/server/boards/create', function (message) {
    var board = new Board(message.board);
    board.createdByUserId = message.meta.userId;
    board.createdOn = Date.now();
    board.cardTypes.push(
      { board: board, name: 'Story', icon: 'book', pointScale: '1,2,3,5,8', isDefault: true },
      { board: board, name: 'Bug', icon: 'bug', priority: 1 },
      { board: board, name: 'Task', icon: 'wrench' });
    board.defaultCardTypeId = board.cardTypes[0].id;
    board.lanes.push(
      { name: 'Unplanned', order: 0, defaultIsVisible: false },
      { name: 'Backlog', order: 1 },
      { name: 'In Progress', order: 2 },
      { name: 'Done', order: 3 });

    board.save(function (err, board) {
      if (err) {
        return app.pubsub.publishError('/boards/create', '/boards/create', {
          message: 'Failed to create board',
          details: err,
          context: message
        });
      }
      board = board.toJSON();
      recordHistory(message, 'board', 'create', board);
      app.pubsub.publishToClient('/boards/create', { board: board }, message);

      // notify all subscribers
      app.pubsub.publish('/boards', {
        action: 'create',
        board: {
          id: board.id,
          name: board.name
        }
      });
    });
  });

  app.pubsub.subscribe('/server/boards/get', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err) {
        return app.pubsub.publishError('/boards/get', '/boards/get', {
          message: 'Failed to get board',
          details: err,
          context: message
        });
      }
      if (!board) {
        return app.pubsub.publishError('/boards/get', {
          errorCode: 404,
          message: 'Board not found',
          context: message
        });
      }
      app.pubsub.publishToClient('/boards/get', { board: board.toJSON() }, message);
    });
  });

  // app.put('/api/boards/:id', authorise, function (req, res, next) {
  //   Board.findById(req.params.id, function (err, board) {
  //     if (err) { return next(err); }
  //     var oldValues = updateProperties(board, req.body.board, ['name', 'defaultCardType']);
  //     recordHistory(req.user, 'board', 'update', board.toJSON(), oldValues);
  //     board.save(function (err, board) {
  //       if (err) { return next(err); }
  //       res.send({});
  //     });
  //   });
  // });

  app.pubsub.subscribe('/server/boards/destroy', function (message) {
    Board.findByIdAndRemove(message.board.id, function (err, board) {
      if (err) {
        return app.pubsub.publishError('/boards/destroy', '/boards/destroy', {
          message: 'Failed to get board',
          details: err,
          context: message
        });
      }
      if (!board) {
        return app.pubsub.publishError('/boards/destroy', {
          errorCode: 404,
          message: 'Board not found',
          context: message
        });
      }
      recordHistory(message, 'board', 'delete', board.toJSON());
      app.pubsub.publishToClient('/boards/destroy', {}, message);

      // notify all subscribers
      app.pubsub.publish('/boards', {
        action: 'destroy',
        board: { id: board.id }
      });
    });
  });
};
