App.AttachmentView = Ember.View.extend({
  setup: function () {
    var controller = this.controller;
    window.jQuery.pasteimage(function (src) {
      controller.set('model.image', src);
    });
  }.on('didInsertElement')
});
