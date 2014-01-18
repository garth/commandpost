App.BoardEditRoute = Ember.Route.extend({
  setupController: function (controller, board) {
    controller.setProperties({
      confirmDelete: null
    });
  }
});

App.BoardEditController = Ember.ObjectController.extend({
  needs: ['board'],
  modelBinding: 'controllers.board.model',

  confirmDelete: null,

  actions: {

    addLane: function () {
      var board = this.get('content');
      var lanes = board.get('lanes');
      var lane = App.Lane.create({
        board: board,
        name: 'New Lane',
        type: 'queue',
        order: lanes.length,
        cards: []
      });
      lanes.pushObject(lane);
    },

    deleteLane: function (lane) {
      var lanes = this.get('content.lanes');
      if (lane.get('cards.length') === 0) {
        lanes.removeObject(lane);
      }
      else {
        App.flash.error('Lanes with cards cannot be deleted');
      }
    },

    addCardType: function () {
      var board = this.get('content');
      var cardTypes = board.get('cardTypes');
      var cardType = App.CardType.create({
        board: board,
        name: 'New Card Type',
        icon: 'thumbs-up',
        pointScale: '1,2,3,5,8',
        priority: 0,
        isHidden: false
      });
      cardTypes.pushObject(cardType);
    },

    // deleteCardType: function (cardType) {
    //   var cardTypes = this.get('content.cardTypes');
    //   cardTypes.removeObject(cardType);
    // },

    save: function () {
      var board = this.get('content');
      var lanes = board.get('lanes');
      var cardTypes = board.get('cardTypes');
      var self = this;
      // prepare to save the board
      board = board.getProperties('id', 'name', 'defaultCardTypeId');
      // save lanes
      board.lanes = lanes.map(function (lane) {
        return lane.getProperties('id', 'name', 'type', 'order');
      });
      // save card type
      board.cardTypes = cardTypes.map(function (cardType) {
        return cardType.getProperties('id', 'name', 'icon', 'pointScale', 'priority', 'isHidden');
      });
      // save the board
      App.pubsub.publishAwait('/boards/update', {
        board: board
      }).then(function (message) {
        self.transitionToRoute('board.view');
      });
    },

    'delete': function () {
      var board = this.get('content');
      var self = this;
      if (this.get('confirmDelete') === board.get('name')) {
        // delete the board
        App.pubsub.publishAwait('/boards/delete', {
          board: { id: board.get('id') }
        }).then(function (message) {
          self.transitionToRoute('boards.index');
        });
      }
      else {
        App.flash.error('Please confirm the board name to delete');
      }
    }
  }
});
