App.ModalDialogComponent = Ember.Component.extend({

  setup: function () {
    this.$('.modal').modal('show');
  }.on('didInsertElement'),

  actions: {
    close: function () {
      this.$('.modal').modal('hide');
      var self = this;
      setTimeout(function () {
        self.sendAction('closeModal');
        self.sendAction();
      }, 300);
    }
  }
});
