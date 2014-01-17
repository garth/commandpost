require('../views/lane');

App.BoardLaneController = Ember.ObjectController.extend({
  sortedCards: null,

  icon: function () {
    switch (this.get('model.type')) {
    case 'hidden':
      return 'fa-archive';
    case 'done':
      return 'fa-check';
    case 'in-progress':
      return 'fa-cog';
    default:
      return 'fa-inbox';
    }
  }.property('model.type'),

  cardsChanged: function () {
    Ember.run.once(this, 'sortCards');
  }.observes('content.cards', 'content.cards.@each.priority', 'content.cards.@each.order')
   .on('init'),

  sortCards: function () {
    console.log('sort lane');
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
