require('../models/board');

App.BoardsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('board');
  }
});

App.BoardsViewController = Ember.ObjectController.extend({
  laneStyle: function () {
    var count = this.get('visibleLanes').length;
    return 'width: ' + (count > 0 ? 100.0 / count : 0) + '%';
  }.property('visibleLanes'),

  sortedLanes: function () {
    var lanes = Ember.A(this.get('content.lanes.content'));
    return lanes.sortBy('order');
  }.property('content.lanes.@each.order'),

  visibleLanes: function () {
    return this.get('sortedLanes').filter(function (lane) {
      return lane.get('isVisible');
    });
  }.property('sortedLanes.@each.isVisible'),

  actions: {
    toggleLane: function (lane) {
      lane.set('isVisible', !lane.get('isVisible'));
    },
    addCard: function () {
      // find the first lane that defaults to being visible
      var lane = this.get('sortedLanes').find(function (lane) {
        return lane.get('defaultIsVisible');
      });
      var cards = lane.get('cards');
      var card = this.get('store').createRecord('card', {
        lane: lane,
        title: 'New Card',
        order: cards.get('content').length,
        points: 0
      });
      cards.pushObject(card);
      card.save();
    }
  }
});
