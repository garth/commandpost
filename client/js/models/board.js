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
    var lanes = this.get('lanes');
    if (lanes) {
      this.set('lanes', _.map(lanes, function (lane) {
        lane.board = self;
        return App.Lane.create(lane);
      }));
    }
    var cardTypes = this.get('cardTypes');
    if (cardTypes) {
      this.set('cardTypes', _.map(cardTypes, function (cardType) {
        cardType.board = self;
        return App.CardType.create(cardType);
      }));
    }
  },

  defaultCardType: function () {
    var cardTypes = this.get('cardTypes');
    var defaultCardTypeId = this.get('defaultCardTypeId');
    if (cardTypes && defaultCardTypeId) {
      return cardTypes.findBy('id', defaultCardTypeId);
    }
  }.property('defaultCardTypeId', 'cardTypes'),

  createdByUser: function () {
    var users = App.get('users');
    var createdByUserId = this.get('createdByUserId');
    if (users && createdByUserId) {
      return users.findBy('id', createdByUserId);
    }
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
