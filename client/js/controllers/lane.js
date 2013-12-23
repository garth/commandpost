require('../views/lane');

App.BoardsLaneController = Ember.ObjectController.extend({
  sortedCards: function () {
    var cards = Ember.A(this.get('model.cards'));
    return cards.sortBy('priority', 'order');
  }.property('model.cards.@each.priority', 'model.cards.@each.order')
});
