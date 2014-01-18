App.History = Ember.Object.extend({
  card: null,

  id: null,
  userId: null,
  date: null,
  laneName: null,
  action: null,

  user: function () {
    var userId = this.get('userId');
    return App.userIndex[userId];
  }.property('userId', 'App.users')
});
