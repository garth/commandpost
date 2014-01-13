/*jshint sub:true*/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
//var Lane = mongoose.model('Lane');
//var Card = mongoose.model('Card');
//var CardType = mongoose.model('CardType');
var _ = require('underscore');

module.exports = function (app, config, db) {

  // var sortLane = function (laneId, card, newPosition) {
  //   //console.log('sort lane', laneId, card, newPosition);
  //   Lane.findById(laneId, function (err, lane) {
  //     if (err) { return app.pubsub.publish('/error/move', { error: err }); }

  //     // get the cards for the lane
  //     var cards = lane.toJSON()['_cards'];
  //     console.log(cards.length);

  //     // remove the moving card from the lane
  //     var move = card && typeof newPosition === 'number';
  //     if (move) {
  //       cards = _.without(cards, card);
  //     }

  //     console.log(cards.length);

  //     // ensure that the other cards are correctly sorted
  //     cards = _.sortBy(cards, 'order');

  //     console.log(cards.length);

  //     // re-insert the moving card in its new position
  //     if (move) {
  //       if (newPosition < 1) {
  //         cards.unshift(card);
  //       }
  //       else if (newPosition >= cards.length) {
  //         cards.push(card);
  //       }
  //       else {
  //         cards.splice(newPosition, 0, card);
  //       }
  //     }

  //     // update the orders
  //     var newPositions = [];
  //     for (var order = 0; order < cards.length; order++) {
  //       card = cards[order];
  //       if (card.order !== order) {
  //         newPositions.push({ cardId: card._id, order: order });
  //         card.order = order;
  //         Card.findByIdAndUpdate(card._id, card, function (err) {
  //           if (err) { app.pubsub.publish('/error/move', err); }
  //         });
  //       }
  //     }

  //     console.log(cards.length, newPositions);

  //     if (newPositions.length) {
  //       app.pubsub.publish('/board/' + lane.board + '/order/lane', {
  //         laneId: lane.id,
  //         order: newPositions
  //       });
  //     }
  //   });
  // };

  // app.pubsub.subscribe('/card/move', function (message) {
  //   Card.findById(message.cardId, function (err, card) {
  //     if (err) { return app.pubsub.publish('/error/move', { error: err, data: message }); }
  //     //console.log('/card/move/', card.lane);
  //     //console.log(message.lane, card.lane.toString(), message.lane === card.lane.toString());
  //     // if card type has changed then check if the new type has a different priority
  //     // before doing a sort
  //     if (message.oldCardType && message.cardType) {
  //       CardType.find({
  //         _id: { $in: [message.oldCardType, message.cardType] }
  //       }, function (err, cardTypes) {
  //         if (err) { return app.pubsub.publish('/error/move', { error: err, data: message }); }
  //         if (cardTypes.length > 1 && cardTypes[0].priority !== cardTypes[1].priority) {
  //           sortLane(card.lane);
  //         }
  //       });
  //     }
  //     // if the card is moving lanes
  //     else if (message.lane && message.lane !== card.lane.toString()) {
  //       var oldLane = card.lane;
  //       var newLane = message.lane;
  //       card.lane = newLane;
  //       card.save(function (err, card) {
  //         sortLane(oldLane);
  //         sortLane(newLane, card, message.position);
  //       });
  //     }
  //     // move the card within the lane
  //     else {
  //       sortLane(card.lane, card, message.position);
  //     }
  //   });
  // });

};
