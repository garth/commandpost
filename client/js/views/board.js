App.BoardsViewView = Ember.View.extend({
  setup: function () {
    var self = this;
    // yield to sub views so that they can render
    setTimeout(function () {
      // hookup linked lanes
      self.$('.board-lane-list').sortable({
        connectWith: '.board-lane-list'
      });
    }, 1);
  }.on('didInsertElement')
});
