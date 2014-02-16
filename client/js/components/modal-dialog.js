App.ModalDialogComponent = Ember.Component.extend({
  closeModal: 'closeModal',

  title: '',
  closeTitle: 'Cancel',
  closeAction: 'cancel',
  saveTitle: 'Save',
  saveAction: 'save',

  setup: function () {
    var element = this.$('.modal');
    element.modal('show');
    var self = this;
    element.on('hidden.bs.modal', function () {
      self.sendAction('closeModal');
    });
  }.on('didInsertElement'),

  actions: {
    close: function () {
      this.$('.modal').modal('hide');
      var action = this.get('closeAction');
      if (action) {
        this.sendAction(action);
      }
    },
    save: function () {
      this.$('.modal').modal('hide');
      var action = this.get('saveAction');
      if (action) {
        this.sendAction(action);
      }
    }
  },

  showHeader: function () {
    return this.get('closeAction') || this.get('title');
  }.property('closeAction', 'title'),

  showFooter: function () {
    return this.get('closeTitle') || this.get('saveTitle');
  }.property('closeTitle', 'saveTitle')
});
