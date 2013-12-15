require('./sortable-list-item');

App.SortableListComponent = Ember.Component.extend({
  tagName: 'ul',

  sortKey: null,

  setup: function () {
    var self = this;
    this.$().sortable({
      axis: 'y',
      update: function(event, ui) {
        var sort = 0;
        var key = self.get('sortKey');
        if (key) {
          _.each(self.$('li'), function (item) {
            if (item.sortableItem) {
              item.sortableItem.set(key, sort++);
              console.log('updated ', item.sortableItem.getProperties('name', 'order', 'isDirty'));
            }
          });
        }
      }
    });
  }.on('didInsertElement'),

  teardown: function () {
    this.$().sortable('destroy');
  }.on('willDestroyElement')
});
