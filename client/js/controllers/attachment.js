require('../views/attachment');

App.AttachmentController = Ember.ObjectController.extend({

  actions: {
    save: function () {
      console.log('save', this.get('model'));
    },
    cancel: function () {
      console.log('cancel');
    }
  }
});
