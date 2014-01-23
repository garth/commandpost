require('../views/board');

App.BoardViewController = App.ObjectController.extend({
  needs: ['board'],
  modelBinding: 'controllers.board.model',

  laneStyle: function () {
    var count = this.get('visibleLanes').length;
    return 'width: ' + (count > 0 ? 100.0 / count : 0) + '%';
  }.property('visibleLanes'),

  actions: {

    toggleLane: function (lane) {
      lane.set('isVisible', !lane.get('isVisible'));
    },

    toggleLaneStats: function (board) {
      board.set('showLaneStats', !board.get('showLaneStats'));
    },

    addCard: function (begining) {
      // find the first lane that defaults to being visible
      var lane = this.get('model.lanes').find(function (lane) {
        return lane.get('defaultIsVisible');
      });
      var cards = lane.get('cards');
      var card = App.Card.create({
        lane: lane,
        cardTypeId: lane.get('board.defaultCardTypeId'),
        title: 'New Card',
        description: '',
        points: 0,
        tags: [],
        order: begining ? -1 : cards.get('length'),
        comments: [],
        history: [],
        isEditing: true
      });
      cards.addObject(card);
    }
  }
});
