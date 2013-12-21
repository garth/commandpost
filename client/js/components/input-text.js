App.InputTextComponent = Ember.Component.extend({
  focus: false,
  disabled: false,
  type: 'text',

  becomeFocused: function() {
    if (this.get('focus')) {
      this.$('input').focus();
    }
  }.on('didInsertElement')
});
