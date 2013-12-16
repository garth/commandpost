require('../models/board');

App.BoardsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('board');
  }
});

App.BoardsViewController = Ember.ObjectController.extend({
  laneStyle: function () {
    var count = this.get('content.lanes.content.content').length;
    return 'width: ' + (count > 0 ? 100.0 / count : 0) + '%';
  }.property('sortedLanes'),

  sortedLanes: function () {
    var lanes = Ember.A(this.get('content.lanes.content.content'));
    return lanes.sortBy('order');
  }.property('content.lanes.@each.order')
});
