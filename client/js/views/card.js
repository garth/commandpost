App.BoardsCardView = Ember.View.extend({
  setup: function () {
    if (this.controller.get('model.isEditing')) {
      this.$('input')[0].focus();
    }
  }.on('didInsertElement')
});
