var mongoose = require('mongoose');
var Lane = mongoose.model('Lane');
var Card = mongoose.model('Card');
var CardType = mongoose.model('CardType');

module.exports = function (app, config, db) {

  var sortLane = function (lane, card, newPosition) {
    console.log('sortLane');
  };

  app.pubsub.subscribe('/card/move', function (message) {
    Card.findById(message.cardId, function (err, card) {
      if (err) { return app.pubsub.publish('/error/move', { error: err, data: message }); }

      // if card type has changed then check if the new type has a different priority
      // before doing a sort
      if (message.oldCardType && message.cardType) {
        CardType.find({
          _id: { $in: [message.oldCardType, message.cardType] }
        }, function (err, cardTypes) {
          if (err) { return app.pubsub.publish('/error/move', { error: err, data: message }); }
          if (cardTypes.length > 1 && cardTypes[0].priority !== cardTypes[1].priority) {
            sortLane(card.lane);
          }
        });
      }
      // if the card is moving lanes
      else if (message.lane && message.lane !== card.lane.id) {
        var oldLane = card.lane;
        Lane.findById(message.lane, function (err, newLane) {
          if (err) { return app.pubsub.publish('/error/move', { error: err, data: message }); }
          card.lane = message.lane;
          card.save(function (err, card) {
            sortLane(oldLane);
            sortLane(newLane, card, message.position);
          });
        });
      }
      // move the card within the lane
      else {
        sortLane(card.lane, card, message.position);
      }
    });
  });

};
