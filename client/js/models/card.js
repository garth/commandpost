// require('./lane');
// require('./user');
// require('./comment');
// require('./card-type');

App.Card = Ember.Object.extend({
  lane: null,

  id: null,
  cardTypeId: null,
  title: null,
  description: null,
  points: null,
  tags: null,
  createdByUserId: null,
  createdOn: null,
  assignedToUserId: null,
  order: null,
  comments: null,

  isEditing: false,

  init: function() {
    this._super();
    var self = this;
    var comments = this.get('comments');
    if (comments) {
      this.set('comments', _.map(comments, function (comment) {
        comment.card = self;
        return App.Comment.create(comment);
      }));
    }
  },

  priority: function () {
    return (this.get('cardType.priority') || 0) * -1;
  }.property()
});

// App.serverEvents.addEventListener('createCard', function(e) {
//   var store = App.Card.store;
//   var cardData = JSON.parse(e.data).document;
//   var card = store.getById('card', cardData.id);
//   if (!card) {
//     var lane = store.getById('lane', cardData.lane);
//     // add the card if the lane is in the store
//     if (lane) {
//       card = store.push('card', cardData);
//       lane.get('cards.content').pushObject(card);
//     }
//   }
// }, false);

// App.serverEvents.addEventListener('updateCard', function(e) {
//   var store = App.Card.store;
//   var cardData = JSON.parse(e.data).document;
//   var card = store.getById('card', cardData.id);
//   // update the card if it's in the store
//   if (card) {
//     var oldLane = card.get('lane');
//     var newLane = store.getById('lane', cardData.lane);
//     card = store.push('card', cardData);
//     // move lane if necessary
//     if (oldLane.get('id') !== newLane.get('id')) {
//       oldLane.get('cards.content').removeObject(card);
//       newLane.get('cards.content').pushObject(card);
//     }
//   }
// }, false);

// App.serverEvents.addEventListener('deleteCard', function(e) {
//   var store = App.Card.store;
//   var cardData = JSON.parse(e.data).document;
//   var card = store.getById('card', cardData.id);
//   // remove the card from the store
//   if (card && !card.get('isDeleted')) {
//     card.get('lane.cards.content').removeObject(card);
//     store.unloadRecord(card);
//   }
// }, false);
