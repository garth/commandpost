App.ModalDialogComponent = Ember.Component.extend({

  setup: function () {
    var element = this.$('.modal');
    element.modal('show');
    var self = this;
    element.on('hidden.bs.modal', function () {
      self.sendAction('closeModal');
      self.sendAction();
    });
  }.on('didInsertElement'),

  actions: {
    close: function () {
      this.$('.modal').modal('hide');
    }
  }
});
