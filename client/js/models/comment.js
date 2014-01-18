App.Comment = Ember.Object.extend({
  card: null,

  id: null,
  text: null,
  userId: null,
  createdOn: null,

  me: function () {
    return this.get('userId') === App.get('user.id');
  }.property('userId'),

  user: function () {
    var users = App.get('users');
    var userId = this.get('userId');
    if (users && userId) {
      return users.findBy('id', userId);
    }
  }.property('userId', 'App.users')
});
