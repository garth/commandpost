App.FlashMessage = Ember.Object.extend({
  type: null,
  icon: null,
  message: null,

  typeClass: function () {
    return 'alert-' + this.get('type');
  }.property('type'),


  iconClass: function () {
    return 'fa fa-' + this.get('icon');
  }.property('icon')
});
