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
  console.log('create', e.data, store);
}, false);

App.serverEvents.addEventListener('updateCard', function(e) {
  var store = App.Card.store;
  console.log('update', e.data, store);
}, false);

App.serverEvents.addEventListener('deleteCard', function(e) {
  var store = App.Card.store;
  console.log('delete', e.data, store);
}, false);
