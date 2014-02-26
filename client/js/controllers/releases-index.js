App.ReleasesIndexRoute = Ember.Route.extend({
  model: function (params) {
    var board = this.modelFor('board');
    return App.pubsub.publishAwait('/releases', {
      board: board.getProperties('id')
    }, function (message) {
      return _.map(message.releases, function (release) {
        return App.ReleaseSummary.create(release);
      });
    });
  }
});

App.ReleasesIndexController = App.ArrayController.extend({
  needs: ['board'],
  board: null,
  boardBinding: 'controllers.board.model',

  boardObserver: function () {
    // check if this board is the same as before
    var boardId = this.get('board.id');
    if (this.boardId === boardId) {
      return;
    }
    this.boardId = boardId;

    // unsubscribe to previous board channels
    this.unsubscribeAll();

    // setup subscriptions for this board
    var self = this;
    var subscriptions = {};

    subscriptions['/boards/' + boardId + '/releases'] = function (message) {
      if (message.action === 'create') {
        var releases = this.get('model');
        releases && releases.pushObject(App.ReleaseSummary.create(message.release));
      }
    };

    this.subscribe(subscriptions);
  }.observes('board')
});
