App.History = Ember.Object.extend({
  card: null,

  id: null,
  userId: null,
  date: null,
  laneName: null,
  action: null,

  user: function () {
    var users = App.get('users');
    var userId = this.get('userId');
    if (users && userId) {
      return users.findBy('id', userId);
    }
  }.property('userId', 'App.users')
});
