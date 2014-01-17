require('./card');

App.Comment = Ember.Object.extend({
  card: null,

  id: null,
  text: null,
  userId: null,
  createdOn: null,

  user: function () {
    var users = App.get('users');
    var userId = this.get('userId');
    if (users && userId) {
      return users.findBy('id', userId);
    }
  }.property('userId', 'App.users')
});
