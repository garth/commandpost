require('./user');
require('./lane');
require('./card-type');

App.Board = DS.Model.extend({
  name: DS.attr('string'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date'),
  lanes: DS.hasMany('lane', { async: true }),
  defaultCardType: DS.belongsTo('cardType'),
  cardTypes: DS.hasMany('cardType', { async: true })
});

App.serverEvents.addEventListener('createBoard', function(e) {
  var store = App.Board.store;
  var boardData = JSON.parse(e.data).document;
  var board = store.getById('board', boardData.id);
  if (!board) {
    store.push('board', boardData);
  }
}, false);

App.serverEvents.addEventListener('updateBoard', function(e) {
  var store = App.Board.store;
  var boardData = JSON.parse(e.data).document;
  var board = store.getById('board', boardData.id);
  // update the board if it's in the store
  if (board) {
    store.push('board', boardData);
  }
}, false);

App.serverEvents.addEventListener('deleteBoard', function(e) {
  var store = App.Board.store;
  var boardData = JSON.parse(e.data).document;
  var board = store.getById('board', boardData.id);
  // remove the board from the store
  if (board) {
    store.unloadRecord(board);
  }
}, false);
