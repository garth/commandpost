App.IndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    var applicationController = this.controllerFor('application');

    if (!App.get('isSignedIn')) {
      applicationController.set('savedTransition', transition);
      this.transitionTo('signin');
    }
    else {
      App.pubsub.publishAwait('/users', function (message) {
        App.set('users', _.map(message.users, function (user) {
          return App.User.create(user);
        }));
      });
    }
  }
});

App.IndexIndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    this.transitionTo('boards');
  }
});

App.IndexController = App.Controller.extend({
  subscriptions: {
    '/users': function (message) {
      var users = App.get('users');
      switch (message.action) {
      case 'create':
        users && users.pushObject(App.User.create(message.user));
        break;
      case 'update':
        var user = users && users.findBy('id', message.board.id);
        if (user) {
          user.setProperties(message.user);
        }
        break;
      }
    }
  }
});
