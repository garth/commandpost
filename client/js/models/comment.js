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
    return App.userIndex[this.get('userId')];
  }.property('userId', 'App.users')
});
