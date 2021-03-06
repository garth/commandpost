App.BoardCardView = Ember.View.extend({
  classNameBindings: ['cardClass', 'filterClass'],
  cardClass: 'card',
  filterClass: function () {
    return this.controller.get('model.matchesFilter') ? 'matched' : 'unmatched';
  }.property('controller.model.matchesFilter'),

  setup: function () {
    //auto focus the first input
    if (this.controller.get('model.isEditing')) {
      this.$('input')[0].focus();
    }
    //expand closed cards on double click
    var self = this;
    this.$().dblclick(function () {
      if (!self.controller.get('model.isEditing')) {
        self.controller.send('open');
      }
    });
  }.on('didInsertElement')
});
