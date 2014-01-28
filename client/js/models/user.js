App.User = Ember.Object.extend({
  id: null,
  name: null,
  initials: null,
  role: null,

  isAdmin: function () {
    return this.get('role') === 'admin';
  }.property('role')
});
