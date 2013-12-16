require('./sortable-list-item');

var updateSortedItems = function () {
  var sort = 0;
  var list = this.getProperties('sortKey', 'autoSave', 'parent', 'childrenKey', 'parentKey');
  if (list.sortKey) {
    _.each(this.$('li'), function (item) {
      var child = item.sortableItem;
      if (child) {
        // set the order
        child.set(list.sortKey, sort++);
        // update the parent
        if (list.parent && list.parentKey &&
          child.get(list.parentKey) !== list.parent) {
          // update the parents childrent collections
          if (list.childrenKey) {
            var collectionPath = list.childrenKey + '.content';
            child.get(list.parentKey + '.' + collectionPath).removeObject(child);
            list.parent.get(collectionPath).pushObject(child);
          }
          // update the childs parent
          child.set(list.parentKey, list.parent);
        }
        // save changes
        if (list.autoSave && child.get('isDirty')) {
          console.log('saving', child);
          child.save();
        }
      }
    });
  }
};

App.SortableListComponent = Ember.Component.extend({
  tagName: 'ul',
  classNameBindings: ['connectWith'],

  parent: null,
  childrenKey: null,
  parentKey: null,
  sortKey: null,
  autoSave: false,
  connectWith: null,

  setup: function () {
    //console.log('col ready', Ember.$('.board-lane-list'));
    var self = this;
    if (this.get('connectWith')) {
      this.$().on('sortupdate', function (event, ui) {
        updateSortedItems.apply(self);
      });
    }
    else {
      this.$().sortable({
        axis: 'y',
        update: function(event, ui) {
          updateSortedItems.apply(self);
        }
      });
    }
  }.on('didInsertElement'),

  teardown: function () {
    this.$().sortable('destroy');
  }.on('willDestroyElement')
});
