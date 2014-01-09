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

// App.serverEvents.addEventListener('createCardType', function(e) {
//   var store = App.CardType.store;
//   var cardTypeData = JSON.parse(e.data).document;
//   var cardType = store.getById('cardType', cardTypeData.id);
//   if (!cardType) {
//     var board = store.getById('board', cardTypeData.board);
//     // add the card type if the baord is in the store
//     if (board) {
//       cardType = store.push('cardType', cardTypeData);
//       board.get('cardTypes.content').pushObject(cardType);
//     }
//   }
// }, false);

// App.serverEvents.addEventListener('updateCardType', function(e) {
//   var store = App.Card.store;
//   var cardTypeData = JSON.parse(e.data).document;
//   var cardType = store.getById('cardType', cardTypeData.id);
//   // update the card type if it's in the store
//   if (cardType) {
//     store.push('cardType', cardTypeData);
//   }
// }, false);

// App.serverEvents.addEventListener('deleteCardType', function(e) {
//   var store = App.Card.store;
//   var cardTypeData = JSON.parse(e.data).document;
//   var cardType = store.getById('cardType', cardTypeData.id);
//   // remove the card type from the store
//   if (cardType && !cardType.get('isDeleted')) {
//     cardType.get('board.cardTypes.content').removeObject(cardType);
//     store.unloadRecord(cardType);
//   }
// }, false);
