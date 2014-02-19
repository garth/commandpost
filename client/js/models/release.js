require('./card');

App.Release = Ember.Object.extend({
  id: null,
  boardId: null,
  version: null,
  description: null,
  createdByUserId: null,
  createdOn: null,
  cards: null,

  init: function() {
    this._super();

    // prepare data
    var cards = this.get('cards');
    if (!cards) {
      cards = [];
    }
    this.set('cards', _.map(cards, function (card) {
      return App.Card.create(card);
    }));
  }
});
