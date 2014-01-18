App.BoardRoute = Ember.Route.extend({
  model: function (params) {
    return App.pubsub.publishAwait('/boards/get', {
      board: { id: params.board_id }
    }, function (message) {
      return App.Board.create(message.board);
    });
  }
});

App.BoardController = App.ObjectController.extend({
  boardObserver: function () {
    // check if this board is the same as before
    var boardId = this.get('model.id');
    if (this.boardId === boardId) {
      return;
    }
    this.boardId = boardId;

    // unsubscribe to previous board channels
    this.unsubscribeAll();

    // setup subscriptions for this board
    var self = this;
    var subscriptions = {};

    subscriptions['/boards/' + boardId] = function (message) {
      switch (message.action) {
      case 'update':
        self.updateBoard(message);
        break;
      case 'delete':
        self.deleteBoard(message);
        break;
      }
    };

    subscriptions['/boards/' + boardId + '/cards'] = function (message) {
      switch (message.action) {
      case 'create':
        self.createCard(message);
        break;
      case 'update':
        self.updateCard(message);
        break;
      case 'move':
        self.moveCards(message);
        break;
      case 'delete':
        self.deleteCard(message);
        break;
      }
    };

    this.subscribe(subscriptions);
  }.observes('model'),

  createCard: function (message) {
    App.flash.info('"' + message.card.title + '" Card has been created');
    var board = this.get('model');
    var lane = board.laneIndex[message.lane.id];
    message.card.lane = lane;
    var card = App.Card.create(message.card);
    board.cardIndex[message.card.id] = card;
    lane.get('cards').pushObject(card);
  },

  updateCard: function (message) {
    var card = this.get('model').cardIndex[message.card.id];
    card.setProperties(message.card);
    var history = message.card.history;
    if (history) {
      card.set('history', _.map(history, function (history) {
        history.card = card;
        return App.History.create(history);
      }));
    }
    //App.flash.info('"' + card.get('title') + '" Card has been updated');
  },

  moveCards: function (message) {
    var board = this.get('model');
    message.cards.forEach(function (card) {
      var cardObj = board.cardIndex[card.id];
      cardObj.set('order', card.order);
      var oldLane = cardObj.get('lane');
      if (oldLane.get('id') !== message.lane.id) {
        oldLane.get('cards').removeObject(cardObj);
        var lane = board.laneIndex[message.lane.id];
        cardObj.set('lane', lane);
        lane.get('cards').pushObject(cardObj);
        App.flash.info('"' + cardObj.get('title') + '" Card has moved from ' +
          oldLane.get('name') + ' to ' + lane.get('name'));
      }
    });
  },

  deleteCard: function (message) {
    var board = this.get('model');
    var lane = board.laneIndex[message.lane.id];
    var card = board.cardIndex[message.card.id];
    lane.get('cards').removeObject(card);
    delete board.cardIndex[message.card.id];
    App.flash.info('"' + card.get('title') + '" Card has been deleted');
  },

  updateBoard: function (message) {
    App.flash.info(message.board.name + ' Board has been updated');
    // make a new board
    var board = App.Board.create(message.board);
    // move the existing cards onto the new board
    var oldBoard = this.get('model');
    var lanes = board.get('lanes');
    lanes.forEach(function (lane) {
      var oldLane = oldBoard.laneIndex[lane.get('id')];
      if (oldLane) {
        var cards = oldLane.get('cards');
        lane.set('cards', cards);
        cards.forEach(function (card) {
          card.set('lane', lane);
          board.cardIndex[card.get('id')] = card;
        });
      }
    });
    // swap the old board for the new one
    this.set('model', board);
  },

  deleteBoard: function (message) {
    App.flash.info(this.get('model.name') + ' Board has been deleted');
    this.transitionToRoute('boards.index');
  }
});
