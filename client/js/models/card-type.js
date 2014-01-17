App.CardType = Ember.Object.extend({
  board: null,

  id: null,
  name: null,
  icon: null,
  pointScale: null,
  priority: null,
  isHidden: null,

  cards: function () {
    var cardType = this;
    var cards = this.get('board.cards');
    if (cards) {
      return cards.filter(function (card) {
        return card && card.get('cardType') === cardType;
      });
    }
    else {
      return [];
    }
  }.property('board.cards')
});
