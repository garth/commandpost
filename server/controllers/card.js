var _ = require('lodash');
var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var updateProperties = require('../helpers/update').properties;

module.exports = function (app, config, db) {

  var recordHistory = require('../helpers/history')(app.pubsub);

  var sortLane = function (board, lane, card, position) {
    _.forEach(lane.cards, function (card) {
      card.cardTypePriority = board.cardTypes.id(card.cardTypeId).priority * -1;
    });
    // sort existing cards
    var cards = _.sortBy(lane.cards, ['cardTypePriority', 'order']);

    // if we are moving a card
    if (card) {
      // add the card to the lane
      card = lane.cards[lane.cards.push(card) - 1];
      card.cardTypePriority = board.cardTypes.id(card.cardTypeId).priority * -1;
      // set the card position
      if (position < 1) {
        card.order = -1;
        cards.unshift(card);
      }
      else if (position >= cards.length) {
        card.order = cards.push(card);
      }
      else {
        card.order = cards[position -1].order + 0.5;
        cards.splice(position, 0, card);
      }
      // update sort order after insert to ensure priority is kept
      cards = _.sortBy(cards, ['cardTypePriority', 'order']);
    }

    // update each card order
    var newPositions = [];
    for (var order = 0; order < cards.length; order++) {
      card = cards[order];
      if (card.order !== order) {
        newPositions.push({ id: card.id, order: order });
        card.order = order;
      }
    }

    // notify subscribers
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

      // check the user permissions
      var role = board.getUserRole(message.meta.user);
      if (role !== 'admin' && role !== 'user') {
        return app.pubsub.publishError('/cards/create', '/cards/create', {
          errorCode: 403,
          message: 'Not authorised',
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
      card = lane.cards[lane.cards.push(card) - 1];
      card.history.push({
        userId: message.meta.user.id,
        date: Date.now(),
        action: 'create',
        laneName: lane.name
      });
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

      // check the user permissions
      var role = board.getUserRole(message.meta.user);
      if (role !== 'admin' && role !== 'user') {
        return app.pubsub.publishError('/cards/update', '/cards/update', {
          errorCode: 403,
          message: 'Not authorised',
          context: message
        });
      }

      // find the lane where the card is
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/update', '/cards/update', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // find and update update the card
      var card = lane.cards.id(message.card.id);
      var oldValues = updateProperties(card, message.card, [
        'cardTypeId', 'title', 'description', 'points', 'tags', 'assignedToUserId'
      ]);

      // if card type changed, ensure that the order is still correct
      if (oldValues.cardTypeId) {
        sortLane(board, lane);
      }

      // save the changes
      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/update', '/cards/update', {
            message: 'Failed to update card',
            details: err,
            context: message
          });
        }
        card = card.toJSON();
        delete card.comments;
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

  app.pubsub.subscribe('/server/cards/move', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/move', '/cards/move', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // check the user permissions
      var role = board.getUserRole(message.meta.user);
      if (role !== 'admin' && role !== 'user') {
        return app.pubsub.publishError('/cards/move', '/cards/move', {
          errorCode: 403,
          message: 'Not authorised',
          context: message
        });
      }

      // find the lanes where the card will be moved from and to
      var oldLane = null;
      if (message.oldLane) {
        oldLane = board.lanes.id(message.oldLane.id);
      }
      var lane = board.lanes.id(message.lane.id);
      oldLane = oldLane || lane;
      if (!lane) {
        return app.pubsub.publishError('/cards/move', '/cards/move', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // remove the card from the old lane
      var card = oldLane.cards.id(message.card.id).remove();
      if (message.oldLane) {
        // sort the old lane
        sortLane(board, oldLane);
      }

      // sort the new lane and insert the card
      sortLane(board, lane, card, message.card.order);

      if (message.oldLane) {
        // store the move in the card history
        card.history.push({
          userId: message.meta.user.id,
          date: Date.now(),
          action: 'move',
          laneName: lane.name
        });

        // when moving forwards to an 'active' lane, auto assign the
        // card to the user who moved it
        if (lane.type === 'in-progress' && lane.order > oldLane.order) {
          card.assignedToUserId = message.meta.user.id;
        }
      }

      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/move', '/cards/move', {
            message: 'Failed to move card',
            details: err,
            context: message
          });
        }
        // notify the client
        app.pubsub.publishToClient('/cards/move', {}, message);

        if (message.oldLane) {
          // notify all subscribers (history changed)
          card = card.toJSON();
          delete card.comments;
          app.pubsub.publish('/boards/' + board.id + '/cards', {
            action: 'update',
            board: { id: board.id },
            lane: { id: lane.id },
            card: card
          });
        }
      });
    });
  });

  app.pubsub.subscribe('/server/cards/delete', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/delete', '/cards/delete', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // check the user permissions
      var role = board.getUserRole(message.meta.user);
      if (role !== 'admin') {
        return app.pubsub.publishError('/cards/delete', '/cards/delete', {
          errorCode: 403,
          message: 'Not authorised',
          context: message
        });
      }

      // find the lane where the card will be removed
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/delete', '/cards/delete', {
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
          return app.pubsub.publishError('/cards/delete', '/cards/delete', {
            message: 'Failed to delete card',
            details: err,
            context: message
          });
        }
        card = card.toJSON();
        recordHistory(message, 'card', 'delete', card);

        // notify the client
        app.pubsub.publishToClient('/cards/delete', {}, message);

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/cards', {
          action: 'delete',
          board: { id: board.id },
          lane: { id: lane.id },
          card: { id: card.id }
        });
      });
    });
  });
};
