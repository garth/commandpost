require('../views/lane');

App.BoardsLaneController = Ember.ObjectController.extend({
  sortedCards: null,

  cardsChanged: function () {
    Ember.run.once(this, 'sortCards');
  }.observes('content.cards.@each.priority', 'content.cards.@each.order').on('init'),

  sortCards: function () {
    var list = this.get('model.cards').sortBy('priority', 'order');
    for (var order = 0; order < list.length; order++) {
      var card = list[order];
      if (card.get('order') !== order) {
        card.set('order', order);
        card.save();
      }
    }
    this.set('sortedCards', list);
  }
});
