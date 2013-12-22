require('../views/lane');

App.BoardsLaneController = Ember.ObjectController.extend({
  sortedCards: function () {
    var cards = Ember.A(this.get('content.cards'));
    return cards.sortBy('order');
  }.property('content.cards.@each.order')
});
