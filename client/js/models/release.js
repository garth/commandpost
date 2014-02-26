require('./card');

App.ReleaseSummary = Ember.Object.extend({
  id: null,
  boardId: null,
  version: null,
  description: null,
  createdOn: null
});

App.Release = App.ReleaseSummary.extend({
  createdByUserId: null,
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
