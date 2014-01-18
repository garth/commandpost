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
    var userId = this.get('userId');
    return App.userIndex[userId];
  }.property('userId', 'App.users')
});
