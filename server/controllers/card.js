var _ = require('lodash');
var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var updateProperties = require('../helpers/update').properties;

module.exports = function (app, config, db) {

  var recordHistory = require('../helpers/history')(app.pubsub);

  var sortLane = function (board, lane) {
    var cards = _.sortBy(lane.cards, 'order');
    var newPositions = [];
    for (var order = 0; order < cards.length; order++) {
      var card = cards[order];
      if (card.order !== order) {
        newPositions.push({ id: card.id, order: order });
        card.order = order;
      }
    }
    if (newPositions.length) {
      app.pubsub.publish('/boards/' + board.id + '/cards', {
        action: 'move',
        board: { id: board.id },
        lane: { id: lane.id },
        cards: newPositions
      });
    }
  };

  app.pubsub.subscribe('/server/cards/create', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/create', '/cards/create', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // find the lane where the card will be added
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/create', '/cards/create', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // add the card to the lane
      var card = message.card;
      card.createdByUserId = message.meta.userId;
      card.createdOn = Date.now();
      card = lane.cards[lane.cards.push(card) - 1];
      sortLane(board, lane);

      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/create', '/cards/create', {
            message: 'Failed to create card',
            details: err,
            context: message
          });
        }
        card = card.toJSON();
        recordHistory(message, 'card', 'create', card);

        // notify the client
        app.pubsub.publishToClient('/cards/create', { card: card }, message);

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/cards', {
          action: 'create',
          board: { id: board.id },
          lane: { id: lane.id },
          card: card
        });
      });
    });
  });

  app.pubsub.subscribe('/server/cards/update', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/update', '/cards/update', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // find the lane where the card will be added
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/update', '/cards/update', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // remove the card from the lane
      var card = lane.cards.id(message.card.id);
      var oldValues = updateProperties(card, message.card, [
        'cardTypeId', 'title', 'description', 'points', 'tags', 'assignedToUserId'
      ]);

      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/update', '/cards/update', {
            message: 'Failed to update card',
            details: err,
            context: message
          });
        }
        card = card.toJSON();
        recordHistory(message, 'card', 'update', card, oldValues);

        // notify the client
        app.pubsub.publishToClient('/cards/update', {}, message);

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/cards', {
          action: 'update',
          board: { id: board.id },
          lane: { id: lane.id },
          card: card
        });
      });
    });
  });

  app.pubsub.subscribe('/server/cards/destroy', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/destroy', '/cards/destroy', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // find the lane where the card will be added
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/destroy', '/cards/destroy', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // remove the card from the lane
      var card = lane.cards.id(message.card.id).remove();
      sortLane(board, lane);

      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/destroy', '/cards/destroy', {
            message: 'Failed to delete card',
            details: err,
            context: message
          });
        }
        card = card.toJSON();
        recordHistory(message, 'card', 'delete', card);

        // notify the client
        app.pubsub.publishToClient('/cards/destroy', {}, message);

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/cards', {
          action: 'destroy',
          board: { id: board.id },
          lane: { id: lane.id },
          card: { id: card.id }
        });
      });
    });
  });
};
