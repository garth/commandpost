var _ = require('lodash');
var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var updateProperties = require('../helpers/update').properties;
var updateCollection = require('../helpers/update').collection;

var getUsedCardTypeIds = function (board) {
  var used = [];
  _.forEach(board.lanes, function (lane) {
    used = _.union(used, _.map(lane.cards, function (card) {
      return card.cardTypeId.toString();
    }));
  });
  return used;
};

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
    // create a board with a default set of card types and lanes
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

    // save the new board
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
      // notify the client
      app.pubsub.publishToClient('/boards/create', { board: board }, message);

      // notify all subscribers
      app.pubsub.publish('/boards', {
        action: 'create',
        board: { id: board.id, name: board.name }
      });
    });
  });

  app.pubsub.subscribe('/server/boards/get', function (message) {
    // find the board
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/boards/get', '/boards/get', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }
      // notify the client
      app.pubsub.publishToClient('/boards/get', { board: board.toJSON() }, message);
    });
  });

  app.pubsub.subscribe('/server/boards/update', function (message) {
    // find the board
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/boards/update', '/boards/update', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to update board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // update the changed board values
      var oldValues = updateProperties(board, message.board, ['name', 'defaultCardType']);

      // update the changed card types
      var cardTypesInUse = null;
      var cardTypesNotDeleted = [];
      oldValues.cardTypes = updateCollection(board.cardTypes, message.board.cardTypes, [
        'name', 'icon', 'pointScale', 'priority', 'isHidden'
      ], function (cardType) {
        // check if the card type can be deleted
        cardTypesInUse = cardTypesInUse || getUsedCardTypeIds(board);
        var canDelete = cardTypesInUse.indexOf(cardType.id.toString()) === -1;
        if (!canDelete) {
          cardTypesNotDeleted.push(cardType.id);
        }
        return canDelete;
      });

      // update the changed lanes
      var lanesNotDeleted = [];
      oldValues.lanes = updateCollection(board.lanes, message.board.lanes, [
        'name', 'order', 'defaultIsVisible'
      ], function (lane) {
        // check if the lane can be deleted
        var canDelete = lane.cards.length === 0;
        if (!canDelete) {
          lanesNotDeleted.push(lane.id);
        }
        return canDelete;
      });

      // save changes
      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/boards/update', '/boards/update', {
            message: 'Failed to update board',
            details: err,
            context: message
          });
        }

        // remove all cards from the board
        board.lanes.forEach(function (lane) { delete lane.cards; });
        board = board.toJSON();

        // record the update
        recordHistory(message, 'board', 'update', board, oldValues);

        // notify the client
        var doc = { board: board };
        if (lanesNotDeleted.length || cardTypesNotDeleted.length) {
          doc.message =
            'Some lanes and/or card types could not be removed becuase they are in use';
          doc.lanesNotDeleted = lanesNotDeleted;
          doc.cardTypesNotDeleted = cardTypesNotDeleted;
        }
        app.pubsub.publishToClient('/boards/update', doc, message);

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/update', { board: board });
        if (oldValues.name) {
          app.pubsub.publish('/boards', {
            action: 'update',
            board: { id: board.id, name: board.name }
          });
        }
      });
    });
  });

  app.pubsub.subscribe('/server/boards/destroy', function (message) {
    // remove the board
    Board.findByIdAndRemove(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/boards/destroy', '/boards/destroy', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }
      recordHistory(message, 'board', 'delete', board.toJSON());

      // notify the client
      app.pubsub.publishToClient('/boards/destroy', {}, message);

      // notify all subscribers
      app.pubsub.publish('/boards', {
        action: 'destroy',
        board: { id: board.id }
      });
    });
  });
};
