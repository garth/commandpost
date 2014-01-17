App.BoardsNewRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('board.edit', App.pubsub.publishAwait('/boards/create', {
      board: { name: 'New' }
    }, function (message) {
      return App.Board.create(message.board);
    }));
  }
});
