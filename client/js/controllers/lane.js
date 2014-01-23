require('../views/lane');

App.BoardLaneController = Ember.ObjectController.extend({
  cardMoved: function (lane, card, position, oldLane) {
    // publish the move
    var message = {
      board: { id: lane.get('board.id') },
      lane: { id: lane.get('id') },
      card: { id: card.get('id'), order: position }
    };
    if (oldLane) {
      message.oldLane = { id: oldLane.get('id') };
    }
    App.pubsub.publish('/server/cards/move', message);
  }
});
