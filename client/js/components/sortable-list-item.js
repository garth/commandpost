App.SortableListItemComponent = Ember.Component.extend({
  tagName: 'li',

  item: null,

  setup: function () {
    this.$()[0].sortableItem = this.get('item');
  }.on('didInsertElement')
});
