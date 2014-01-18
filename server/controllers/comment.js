var mongoose = require('mongoose');
var Board = mongoose.model('Board');

module.exports = function (app, config, db) {

  app.pubsub.subscribe('/server/cards/comments/create', function (message) {
    Board.findById(message.board.id, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/cards/comments/create', '/cards/comments/create', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // find the lane where the comment will be added
      var lane = board.lanes.id(message.lane.id);
      if (!lane) {
        return app.pubsub.publishError('/cards/comments/create', '/cards/comments/create', {
          errorCode: 404,
          message: 'Lane not found',
          context: message
        });
      }

      // find the card where the comment will be added
      var card = lane.cards.id(message.card.id);
      if (!card) {
        return app.pubsub.publishError('/cards/comments/create', '/cards/comments/create', {
          errorCode: 404,
          message: 'Card not found',
          context: message
        });
      }

      // add the comment to the card
      var comment = message.comment;
      comment.createdOn = Date.now();
      comment.userId = message.meta.userId;
      comment = card.comments[card.comments.push(comment) - 1];

      board.save(function (err, board) {
        if (err) {
          return app.pubsub.publishError('/cards/comments/create', '/cards/comments/create', {
            message: 'Failed to create comment',
            details: err,
            context: message
          });
        }

        // notify all subscribers
        app.pubsub.publish('/boards/' + board.id + '/cards/comments', {
          action: 'create',
          board: { id: board.id },
          lane: { id: lane.id },
          card: { id: card.id },
          comment: comment.toJSON()
        });
      });
    });
  });
};
