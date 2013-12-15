require('../models/board');

var Promise = Ember.RSVP.Promise;

App.BoardsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('board');
  }
});

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

  actions: {
    save: function () {
      var board = this.get('content');
      var self = this;
      board.save().then(function (board) {
        self.transitionToRoute('boards.view', board);
      }, function (err) {
        App.flash.serverError('Failed to save board', err);
      });
    },
    'delete': function () {
      var board = this.get('content');
      if (this.get('confirmDelete') === board.get('name')) {
        board.deleteRecord();
        board.save();
        this.transitionToRoute('boards');
      }
    }
  }
});

App.BoardsViewController = Ember.ObjectController.extend({

});
