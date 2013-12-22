App.CardIconComponent = Ember.Component.extend({
  tagName: 'i',
  classNameBindings: ['iconClass'],

  icon: null,

  iconClass: function () {
    return 'card-icon fa fa-fw fa-' + this.get('icon');
  }.property('icon')
});
