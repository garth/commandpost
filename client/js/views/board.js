App.BoardViewView = Ember.View.extend({
  setup: function () {
    // Stop froms inside dropdowns from closing when clicking elements
    this.$('.dropdown-menu .form-group').click(function (event) {
      event.stopPropagation();
    });

    // setup keyboard shortcuts
    this.bindKey('n', 'addCard');
  }.on('didInsertElement'),

  teardown: function () {
    this.unbindKey('n');
  }.on('willDestroyElement')
});
