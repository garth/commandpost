require('./sortable-list-item');

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
    var self = this;
    var connectWith = this.get('connectWith');
    this.$().sortable({
      update: function(event, ui) {
        var sort = 0;
        var list = self.getProperties('sortKey', 'autoSave', 'parent', 'childrenKey', 'parentKey');
        if (list.sortKey) {
          _.each(self.$('li'), function (item) {
            var child = item.sortableItem;
            if (child) {
              // set the order
              child.set(list.sortKey, sort++);
              // update the parent
              var movedLane = false;
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
                movedLane = true;
              }
              // save changes
              if (list.autoSave && (movedLane || child.get('isDirty'))) {
                child.save();
              }
            }
          });
        }
      }
    });
    if (connectWith) {
      Ember.$('.ui-sortable.' + connectWith).sortable('option', 'connectWith', '.' + connectWith);
    }
  }.on('didInsertElement'),

  teardown: function () {
    this.$().sortable('destroy');
  }.on('willDestroyElement')
});
