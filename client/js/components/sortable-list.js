require('./sortable-list-item');

App.SortableListComponent = Ember.Component.extend({
  tagName: 'ul',
  classNameBindings: ['connectWith'],

  collection: null,
  parent: null,
  parentKey: null,
  sortKey: null,
  onMove: null,
  connectWith: null,
  itemClass: '',

  setup: function () {
    var root = this.$();
    root[0].sortableParent = this;
    var connectWith = this.get('connectWith');
    root.sortable({
      stop: function (event, ui) {
        var self = ui.item[0].parentElement.sortableParent;
        var list = self.getProperties('sortKey', 'onMove', 'parent', 'parentKey');

        // which item moved
        var movedItem = ui.item[0].sortableItem;
        var oldParent;

        // check for a lane move
        if (list.parent && list.parentKey && movedItem.get(list.parentKey) !== list.parent) {
          oldParent = movedItem.get(list.parentKey);
        }

        // update sort order properties
        if (list.sortKey) {
          var sort = 0;
          _.each(self.$('li'), function (item) {
            var child = item.sortableItem;
            if (child) {
              // set the order
              child.set(list.sortKey, sort++);
            }
          });
        }

        // find the new position
        var position;
        var notify = typeof list.onMove === 'function';
        if (notify) {
          var items = self.$('li');
          for (position = 0; position < items.length; position++) {
            if (movedItem === items[position].sortableItem) {
              break;
            }
          }
        }

        // let ember do the sort (should be before notify)
        root.sortable('cancel');

        // notify callback
        if (notify) {
          list.onMove(list.parent, movedItem, position, oldParent);
        }
      }
    });
    if (connectWith) {
      Ember.$('.ui-sortable.' + connectWith).sortable('option', 'connectWith', '.' + connectWith);
    }
  }.on('didInsertElement'),

  teardown: function () {
    this.$().sortable('destroy');
  }.on('willDestroyElement'),

  // override the default yield so that we can pass "each" context
  _yield: function(context, options) {
    var get = Ember.get,
    view = options.data.view,
    parentView = this._parentView,
    template = get(this, 'template');

    if (template) {
      Ember.assert("A Component must have a parent view in order to yield.", parentView);
      view.appendChild(Ember.View, {
        isVirtual: true,
        tagName: '',
        _contextView: parentView,
        template: template,
        context: get(view, 'context'), // the default is get(parentView, 'context'),
        controller: get(parentView, 'controller'),
        templateData: { keywords: parentView.cloneKeywords() }
      });
    }
  }
});
