require('./board');
require('./card');

App.Lane = DS.Model.extend({
  board: DS.belongsTo('board'),
  name: DS.attr('string'),
  order: DS.attr('number'),
  cards: DS.hasMany('card', { async: true })
});

App.serverEvents.addEventListener('createLane', function(e) {
  var store = App.Lane.store;
  console.log('create', e.data, store);
}, false);

App.serverEvents.addEventListener('updateLane', function(e) {
  var store = App.Lane.store;
  console.log('update', e.data, store);
}, false);

App.serverEvents.addEventListener('deleteLane', function(e) {
  var store = App.Lane.store;
  console.log('delete', e.data, store);
}, false);
