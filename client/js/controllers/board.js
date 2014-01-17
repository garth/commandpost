App.BoardRoute = Ember.Route.extend({
  model: function (params) {
    return App.pubsub.publishAwait('/boards/get', {
      board: { id: params.board_id }
    }, function (message) {
      return App.Board.create(message.board);
    });
  }
});

App.BoardViewController = App.ObjectController.extend({
});
