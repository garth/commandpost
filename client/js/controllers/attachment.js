require('../views/attachment');

App.AttachmentController = Ember.ObjectController.extend({
  actions: {
    save: function () {
      var attachment = this.get('model');
      var card = attachment.get('card');
      var lane = card.get('lane');
      var board = lane.get('board');
      App.pubsub.publish('/server/attachments/add', {
        board: board.getProperties('id'),
        lane: lane.getProperties('id'),
        card: card.getProperties('id'),
        attachment: attachment.getProperties('image')
      });
    },
    cancel: function () { }
  }
});
