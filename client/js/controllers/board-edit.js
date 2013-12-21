require('../models/board');

var Promise = Ember.RSVP.Promise;

App.BoardsNewRoute = Ember.Route.extend({
  redirect: function () {
    var store = this.store;
    var board = store.createRecord('board', {
      name: 'New' // + moment().format('YYYYMMDDHHmmss')
    });
    var self = this;
    this.transitionTo('boards.edit', new Promise(function (resolve, reject) {
      board.save().then(resolve, function (err) {
        board.deleteRecord();
        App.flash.serverError('Failed to create board', err);
        self.transitionTo('boards');
      });
    }));
  }
});

App.BoardsEditRoute = Ember.Route.extend({
  setupController: function (controller, board) {
    controller.setProperties({
      confirmDelete: null,
      content: board
    });
  }
});

App.BoardsEditController = Ember.ObjectController.extend({

  confirmDelete: null,

  sortedLanes: function () {
    var lanes = Ember.A(this.get('content.lanes.content.content'));
    return lanes.sortBy('order');
  }.property('content.lanes.@each.order'),

  visibleCardTypes: function () {
    return this.get('content.cardTypes').filter(function (cardType) {
      return !cardType.get('isHidden');
    });
  }.property('content.cardTypes.@each.isHidden'),

  actions: {

    addLane: function () {
      var board = this.get('content');
      var lanes = board.get('lanes.content');
      var lane = this.get('store').createRecord('lane', {
        board: board,
        name: 'New Lane',
        order: lanes.get('content').length,
        defaultIsVisible: true
      });
      lanes.pushObject(lane);
      lane.save();
    },

    deleteLane: function (lane) {
      var lanes = this.get('content.lanes.content');
      lanes.removeObject(lane);
      lane.deleteRecord();
      lane.save();
    },

    addCardType: function () {
      var board = this.get('content');
      var cardTypes = board.get('cardTypes.content');
      var cardType = this.get('store').createRecord('cardType', {
        board: board,
        name: 'New Card Type',
        icon: 'thumbs-up',
        pointScale: '1,2,3,5,8',
        priority: 0,
        isHidden: false
      });
      cardTypes.pushObject(cardType);
      cardType.save();
    },

    save: function () {
      var board = this.get('content');
      var lanes = board.get('lanes.content.content');
      var cardTypes = board.get('cardTypes.content.content');
      var self = this;
      // save any lane changes
      _.each(lanes, function (lane) {
        if (lane.get('isDirty')) { lane.save(); }
      });
      // save any card type changes
      _.each(cardTypes, function (cardType) {
        if (cardType.get('isDirty')) { cardType.save(); }
      });
      // save the board
      board.save().then(function (board) {
        self.transitionToRoute('boards.view', board);
      }, function (err) {
        App.flash.serverError('Failed to save board', err);
      });
    },

    'delete': function () {
      var board = this.get('content');
      var self = this;
      if (this.get('confirmDelete') === board.get('name')) {
        board.deleteRecord();
        board.save().then(function () {
          self.transitionToRoute('boards.index');
        }, function (err) {
          App.flash.serverError('Failed to delete board', err);
        });
      }
    }
  }
});
