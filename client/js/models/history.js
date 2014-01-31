App.History = Ember.Object.extend({
  card: null,

  id: null,
  userId: null,
  date: null,
  laneName: null,
  action: null,

  user: function () {
    return App.userIndex[this.get('userId')];
  }.property('userId', 'App.users')
});
