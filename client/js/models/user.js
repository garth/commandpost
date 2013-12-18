App.User = DS.Model.extend({
  name: DS.attr('string'),
  password: DS.attr('string')
});

App.serverEvents.addEventListener('createUser', function(e) {
  var store = App.User.store;
  console.log('create', e.data, store);
}, false);

App.serverEvents.addEventListener('updateUser', function(e) {
  var store = App.User.store;
  console.log('update', e.data, store);
}, false);

App.serverEvents.addEventListener('deleteUser', function(e) {
  var store = App.User.store;
  console.log('delete', e.data, store);
}, false);
