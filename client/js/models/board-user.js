App.BoardUser = Ember.Object.extend({
  board: null,

  id: null,
  role: null,
  userId: null,

  roles: ['observer', 'user', 'admin'],

  user: function () {
    return App.userIndex[this.get('userId')];
  }.property('userId', 'App.users')
});
