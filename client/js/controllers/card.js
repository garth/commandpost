App.BoardsCardController = Ember.ObjectController.extend({
  actions: {
    open: function () {
      this.get('model').set('isEditing', true);
    },
    close: function () {
      var card = this.get('model');
      card.set('isEditing', false);
      if (card.get('isDirty')) {
        card.save();
      }
    }
  }
});
