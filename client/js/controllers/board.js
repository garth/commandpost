require('../views/board');

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

    addCard: function (begining) {
      // find the first lane that defaults to being visible
      var lane = this.get('sortedLanes').find(function (lane) {
        return lane.get('defaultIsVisible');
      });
      var cards = lane.get('cards');
      var card = this.get('store').createRecord('card', {
        lane: lane,
        title: 'New Card',
        order: begining ? -1 : cards.get('content').length,
        cardType: lane.get('board.defaultCardType'),
        points: 0,
        isEditing: true
      });
      cards.pushObject(card);
      // only save if at the end, since sorting will auto-save
      if (!begining) {
        card.save();
      }
    }
  }
});
