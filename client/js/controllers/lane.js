App.BoardsLaneController = Ember.ObjectController.extend({
  sortedCards: function () {
    var cards = Ember.A(this.get('content.cards.content.content'));
    return cards.sortBy('order');
  }.property('content.cards.@each.order')
});
