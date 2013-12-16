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

  actions: {
    addLane: function () {
      var board = this.get('content');
      var lanes = board.get('lanes.content');
      var lane = this.get('store').createRecord('lane', {
        board: board,
        name: 'New',
        order: lanes.get('content').length
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
    save: function () {
      var board = this.get('content');
      var lanes = board.get('lanes.content.content');
      var self = this;
      // save any lane changes
      _.each(lanes, function (lane) {
        if (lane.get('isDirty')) { lane.save(); }
      });
      // save the board
      if (board.get('isDirty')) {
        board.save().then(function (board) {
          self.transitionToRoute('boards.view', board);
        }, function (err) {
          App.flash.serverError('Failed to save board', err);
        });
      }
      else {
        this.transitionToRoute('boards.view', board);
      }
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
