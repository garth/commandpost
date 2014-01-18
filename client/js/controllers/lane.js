require('../views/lane');

App.BoardLaneController = Ember.ObjectController.extend({
  sortedCards: null,

  cardsChanged: function () {
    Ember.run.once(this, 'sortCards');
  }.observes('model.cards', 'model.cards.@each.priority', 'model.cards.@each.order').on('init'),

  sortCards: function () {
    //console.log('sort lane');
    var list = this.get('model.cards').sortBy('priority', 'order');
    for (var order = 0; order < list.length; order++) {
      var card = list[order];
      if (card.get('order') !== order) {
        card.set('order', order);
        //card.save();
      }
    }
    this.set('sortedCards', list);
  },

  cardMoved: function (lane, card, position, oldLane) {
    // until the server responds, ensure that the card stays where we put it
    if (oldLane) {
      card.set('order', position - 0.5);
    }
    // publish the move
    var message = {
      board: { id: card.get('lane.board.id') },
      lane: { id: card.get('lane.id') },
      card: { id: card.get('id'), order: position }
    };
    if (oldLane) {
      message.oldLane = { id: oldLane.get('id') };
    }
    App.pubsub.publish('/server/cards/move', message);
  }
});
