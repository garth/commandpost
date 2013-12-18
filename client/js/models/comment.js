require('./card');
require('./user');

App.Comment = DS.Model.extend({
  card: DS.belongsTo('card'),
  text: DS.attr('string'),
  user: DS.belongsTo('user'),
  createdOn: DS.attr('date')
});

App.serverEvents.addEventListener('createComment', function(e) {
  var store = App.Comment.store;
  console.log('create', e.data, store);
}, false);

App.serverEvents.addEventListener('updateComment', function(e) {
  var store = App.Comment.store;
  console.log('update', e.data, store);
}, false);

App.serverEvents.addEventListener('deleteComment', function(e) {
  var store = App.Comment.store;
  console.log('delete', e.data, store);
}, false);
