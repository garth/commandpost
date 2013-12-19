App.CardType = DS.Model.extend({
  board: DS.belongsTo('board'),
  name: DS.attr('string'),
  icon: DS.attr('string'),
  pointScale: DS.attr('string'),
  priority: DS.attr('number')
});

App.serverEvents.addEventListener('createCardType', function(e) {
  var store = App.CardType.store;
  var cardTypeData = JSON.parse(e.data).document;
  var cardType = store.getById('card-type', cardTypeData.id);
  if (!cardType) {
    var board = store.getById('board', cardTypeData.board);
    // add the card type if the baord is in the store
    if (board) {
      cardType = store.push('card-type', cardTypeData);
      board.get('cardTypes.content').pushObject(cardType);
    }
  }
}, false);

App.serverEvents.addEventListener('updateCardType', function(e) {
  var store = App.Card.store;
  var cardTypeData = JSON.parse(e.data).document;
  var cardType = store.getById('card-type', cardTypeData.id);
  // update the card type if it's in the store
  if (cardType) {
    store.push('card-type', cardTypeData);
  }
}, false);

App.serverEvents.addEventListener('deleteCardType', function(e) {
  var store = App.Card.store;
  var cardTypeData = JSON.parse(e.data).document;
  var cardType = store.getById('card-type', cardTypeData.id);
  // remove the card type from the store
  if (cardType) {
    cardType.get('board.cardTypes.content').removeObject(cardType);
    store.unloadRecord(cardType);
  }
}, false);
