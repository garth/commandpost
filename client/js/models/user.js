App.User = Ember.Object.extend({
  id: null,
  name: null,
  initials: null,
  login: null,
  role: null,

  roles: ['user', 'admin'],

  isAdmin: function () {
    return this.get('role') === 'admin';
  }.property('role'),

  isCurrent: function () {
    return App.get('user') === this;
  }.property('App.user')
});
