require('./user');
require('./lane');

App.Board = DS.Model.extend({
  name: DS.attr('string'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date'),
  lanes: DS.hasMany('lane', { async: true })
});

App.serverEvents.addEventListener('createBoard', function(e) {
  var store = App.Board.store;
  console.log('create', e.data, store);
}, false);

App.serverEvents.addEventListener('updateBoard', function(e) {
  var store = App.Board.store;
  console.log('update', e.data, store);
}, false);

App.serverEvents.addEventListener('deleteBoard', function(e) {
  var store = App.Board.store;
  console.log('delete', e.data, store);
}, false);
