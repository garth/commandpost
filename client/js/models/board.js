// require('./user');
// require('./lane');
// require('./card-type');

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

  createdByuser: function () {
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
  }.property('cardTypes.@each.isHidden'),

  // cards: function () {
  //   var cards = [];
  //   this.get('lanes').forEach(function (lane) {
  //     cards.pushObjects(lane.get('cards'));
  //   });
  //   return cards;
  // }.property('lanes.@each.cards')
});

// App.serverEvents.addEventListener('createBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   if (!board) {
//     store.push('board', boardData);
//   }
// }, false);

// App.serverEvents.addEventListener('updateBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   // update the board if it's in the store
//   if (board) {
//     store.push('board', boardData);
//   }
// }, false);

// App.serverEvents.addEventListener('deleteBoard', function(e) {
//   var store = App.Board.store;
//   var boardData = JSON.parse(e.data).document;
//   var board = store.getById('board', boardData.id);
//   // remove the board from the store
//   if (board && !board.get('isDeleted')) {
//     store.unloadRecord(board);
//   }
// }, false);
