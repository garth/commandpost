var Promise = Ember.RSVP.Promise;

App.BoardsNewRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('boards.edit', App.pubsub.publishAwait('/boards/create', {
      board: { name: 'New' }
    }, function (message) {
      return App.Board.create(message.board);
    }));
  }
});

App.BoardsEditRoute = Ember.Route.extend({
  model: function (params) {
    return App.pubsub.publishAwait('/boards/get', {
      board: { id: params.board_id }
    }, function (message) {
      console.log(message.board);
      return App.Board.create(message.board);
    });
  },
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

    addLane: function () {
      var board = this.get('content');
      var lanes = board.get('lanes');
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
      var lanes = this.get('content.lanes');
      lanes.removeObject(lane);
      lane.deleteRecord();
      lane.save();
    },

    addCardType: function () {
      var board = this.get('content');
      var cardTypes = board.get('cardTypes');
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

    deleteCardType: function (cardType) {
      var cardTypes = this.get('content.cardTypes');
      cardTypes.removeObject(cardType);
      cardType.deleteRecord();
      cardType.save();
    },

    save: function () {
      var board = this.get('content');
      var lanes = board.get('lanes.content');
      var cardTypes = board.get('cardTypes.content');
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
