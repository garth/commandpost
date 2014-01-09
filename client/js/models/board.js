// require('./user');
// require('./lane');
// require('./card-type');

App.Board = Ember.Object.extend({
  id: null,
  name: null,
  createdByUserId: null,
  createdOn: null,
  lanes: null,
  defaultCardTypeId: null,
  cardTypes: null,
  users: null,

  cards: function () {
    var cards = [];
    this.get('lanes').forEach(function (lane) {
      cards.pushObjects(lane.get('cards'));
    });
    return cards;
  }.property('lanes.@each.cards')
});

// App.serverEvents.addEventListener('createBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   if (!board) {
//     store.push('board', boardData);
//   }
// }, false);

// App.serverEvents.addEventListener('updateBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   // update the board if it's in the store
//   if (board) {
//     store.push('board', boardData);
//   }
// }, false);

// App.serverEvents.addEventListener('deleteBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   // remove the board from the store
//   if (board && !board.get('isDeleted')) {
//     store.unloadRecord(board);
//   }
// }, false);
