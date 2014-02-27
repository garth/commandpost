App.ModalDialogComponent = Ember.Component.extend({
  closeModal: 'closeModal',

  title: '',
  closeTitle: 'Cancel',
  closeAction: 'cancel',
  saveTitle: 'Save',
  saveAction: 'save',
  isValid: true,

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
      this.sendAction('closeAction');
    },
    save: function () {
      this.$('.modal').modal('hide');
      this.sendAction('saveAction');
    }
  },

  showHeader: function () {
    return this.get('closeAction') || this.get('title');
  }.property('closeAction', 'title'),

  showFooter: function () {
    return this.get('closeTitle') || this.get('saveTitle');
  }.property('closeTitle', 'saveTitle'),

  showSave: function () {
    return this.get('isValid') && this.get('saveTitle');
  }.property('isValid', 'saveTitle')
});
