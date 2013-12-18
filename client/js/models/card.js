require('./lane');
require('./user');
require('./comment');

App.Card = DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  points: DS.attr('number'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date'),
  assignedToUser: DS.belongsTo('user'),
  lane: DS.belongsTo('lane'),
  order: DS.attr('number'),
  comments: DS.hasMany('comment', { async: true })
});

App.serverEvents.addEventListener('createCard', function(e) {
  var store = App.Card.store;
  var cardData = JSON.parse(e.data).document;
  var lane = store.getById('lane', cardData.lane);
  // add the card if the lane is in the store
  if (lane) {
    var card = store.push('card', cardData);
    lane.get('cards.content').pushObject(card);
  }
}, false);

App.serverEvents.addEventListener('updateCard', function(e) {
  var store = App.Card.store;
  var cardData = JSON.parse(e.data).document;
  var card = store.getById('card', cardData.id);
  // update the card if it's in the store
  if (card) {
    var oldLane = card.get('lane');
    var newLane = store.getById('lane', cardData.lane);
    card = store.push('card', cardData);
    // move lane if necessary
    if (oldLane.get('id') !== newLane.get('id')) {
      oldLane.get('cards.content').removeObject(card);
      newLane.get('cards.content').pushObject(card);
    }
  }
}, false);

App.serverEvents.addEventListener('deleteCard', function(e) {
  var store = App.Card.store;
  var cardData = JSON.parse(e.data).document;
  var card = store.getById('card', cardData.id);
  // remove the card from the store
  if (card) {
    card.get('lane.cards.content').removeObject(card);
    store.unloadRecord(card);
  }
}, false);
