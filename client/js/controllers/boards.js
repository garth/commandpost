App.BoardsRoute = Ember.Route.extend({
  model: function () {
    return App.pubsub.publishAwait('/boards', function (message) {
      return _.map(message.boards, function (board) {
        return App.BoardSummary.create(board);
      });
    });
  }
});

App.BoardsController = App.ArrayController.extend({
  subscriptions: {
    '/boards': function (message) {
      var boards = this.get('model');
      switch (message.action) {
      case 'create':
        boards && boards.pushObject(App.BoardSummary.create(message.board));
        break;
      case 'update':
        var board = boards && boards.findBy('id', message.board.id);
        if (board) {
          board.setProperties(message.board);
        }
        break;
      case 'delete':
        if (boards) {
          this.set('model', boards.rejectBy('id', message.board.id));
        }
        break;
      }
    }
  }
});
