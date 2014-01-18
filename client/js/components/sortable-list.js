require('./sortable-list-item');

Ember.Handlebars.registerHelper('group', function(options) {
  var data = options.data,
      fn   = options.fn,
      view = data.view,
      childView;

  childView = view.createChildView(Ember._MetamorphView, {
    context: Ember.get(view, 'context'),

    template: function(context, options) {
      options.data.insideGroup = true;
      return fn(context, options);
    }
  });

  view.appendChild(childView);
});

App.SortableListComponent = Ember.Component.extend({
  tagName: 'ul',
  classNameBindings: ['connectWith'],

  collection: null,
  parent: null,
  childrenKey: null,
  parentKey: null,
  sortKey: null,
  onMove: null,
  connectWith: null,
  itemClass: '',

  // collectionObserver: function () {
  //   this.$().sortable('refresh');
  // }.observes('collection'),

  setup: function () {
    var self = this;
    var connectWith = this.get('connectWith');
    this.$().sortable({
      update: function (event, ui) {
        // when moving lanes, only process event on destination lane
        if (ui.item[0].parentElement === event.target) {

          var list = self.getProperties('sortKey', 'onMove', 'parent', 'childrenKey', 'parentKey');

          // which item moved
          var movedItem = ui.item[0].sortableItem;

          // check for a lane move
          //console.log(list.parent, list.parentKey);
          if (list.parent && list.parentKey && movedItem.get(list.parentKey) !== list.parent) {
            //console.log('new lane');
            // update the parents children collections
            if (list.childrenKey) {
              movedItem.get(list.parentKey + '.' + list.childrenKey).removeObject(movedItem);
              list.parent.get(list.childrenKey).pushObject(movedItem);
            }
            // update the childs parent
            movedItem.set(list.parentKey, list.parent);
          }

          if (typeof list.onMove === 'function') {
            // find the new position
            var position;
            var items = self.$('li');
            for (position = 0; position < items.length; position++) {
              if (movedItem === items[position].sortableItem) {
                break;
              }
            }

            // notify
            list.onMove(list.parent, movedItem, position);
          }

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
