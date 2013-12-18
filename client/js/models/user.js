App.User = DS.Model.extend({
  name: DS.attr('string'),
  password: DS.attr('string')
});

App.serverEvents.addEventListener('createUser', function(e) {
  var store = App.User.store;
  var userData = JSON.parse(e.data).document;
  var user = store.getById('board', userData.id);
  if (!user) {
    store.push('user', userData);
  }
}, false);

App.serverEvents.addEventListener('updateUser', function(e) {
  var store = App.User.store;
  var userData = JSON.parse(e.data).document;
  var user = store.getById('user', userData.id);
  // update the user if it's in the store
  if (user) {
    store.push('user', userData);
  }
}, false);
