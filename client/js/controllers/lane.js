require('../views/lane');

App.BoardLaneController = Ember.ObjectController.extend({
  sortedCards: null,

  cardsChanged: function () {
    Ember.run.once(this, 'sortCards');
  }.observes('content.cards', 'content.cards.@each.priority', 'content.cards.@each.order')
   .on('init'),


  cardMoved: function (lane, card, position) {
    //console.log(lane, card, position);
    App.flash.info(card.get('title') + ' moved to ' +
      lane.get('name') + ' position ' + position);

    //   // publish the move
    //   App.pubsub.publish('/card/move', {
    //     cardId: movedItem.get('id'),
    //     lane: list.parent.get('id'),
    //     position: position
    //   });
    // }
  },

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
  }
});
