App.Attachement = Ember.Object.extend({
  card: null,

  id: null,
  userId: null,
  createdOn: null,

  user: function () {
    return App.userIndex[this.get('userId')];
  }.property('userId', 'App.users')
});
