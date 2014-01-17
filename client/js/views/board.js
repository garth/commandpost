App.BoardViewView = Ember.View.extend({
  setup: function () {
    this.bindKey('n', 'addCard');
  }.on('didInsertElement'),

  teardown: function () {
    this.unbindKey('n');
  }.on('willDestroyElement')
});
