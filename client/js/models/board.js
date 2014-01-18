require('./lane');
require('./card-type');

App.BoardSummary = Ember.Object.extend({
  id: null,
  name: null
});

App.Board = App.BoardSummary.extend({
  createdByUserId: null,
  createdOn: null,
  lanes: null,
  defaultCardTypeId: null,
  cardTypes: null,

  init: function() {
    this._super();
    var self = this;
    this.laneIndex = {};
    this.cardIndex = {};
    this.cardTypeIndex = {};
    var cardTypes = this.get('cardTypes');
    if (cardTypes) {
      this.set('cardTypes', _.map(cardTypes, function (cardType) {
        cardType.board = self;
        var cardTypeObj = App.CardType.create(cardType);
        self.cardTypeIndex[cardType.id] = cardTypeObj;
        return cardTypeObj;
      }));
    }
    var lanes = this.get('lanes');
    if (lanes) {
      this.set('lanes', _.map(lanes, function (lane) {
        lane.board = self;
        var laneObj = App.Lane.create(lane);
        self.laneIndex[lane.id] = laneObj;
        return laneObj;
      }));
    }
  },

  defaultCardType: function () {
    var defaultCardTypeId = this.get('defaultCardTypeId');
    this.cardTypeIndex[defaultCardTypeId];
  }.property('defaultCardTypeId', 'cardTypes'),

  createdByUser: function () {
    var createdByUserId = this.get('createdByUserId');
    return App.userIndex[createdByUserId];
  }.property('createdByUserId', 'App.users'),

  sortedLanes: function () {
    var lanes = this.get('lanes');
    return lanes.sortBy('order');
  }.property('lanes.@each.order'),

  visibleLanes: function () {
    return this.get('sortedLanes').filter(function (lane) {
      return lane.get('isVisible');
    });
  }.property('sortedLanes.@each.isVisible'),

  visibleCardTypes: function () {
    return this.get('cardTypes').filter(function (cardType) {
      return !cardType.get('isHidden');
    });
  }.property('cardTypes.@each.isHidden')
});
