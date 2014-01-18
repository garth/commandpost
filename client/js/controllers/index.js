App.IndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    var applicationController = this.controllerFor('application');

    if (!App.get('isSignedIn')) {
      applicationController.set('savedTransition', transition);
      this.transitionTo('signin');
    }
    else {
      App.userIndex = {};
      App.pubsub.publishAwait('/users', function (message) {
        App.set('users', _.map(message.users, function (user) {
          var userObj = App.User.create(user);
          App.userIndex[user.id] = userObj;
          return userObj;
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
        if (users) {
          App.flash.info(message.user.name + ' signed up for Command Post');
          var userObj = App.User.create(message.user);
          App.userIndex[message.user.id] = userObj;
          users.pushObject(userObj);
        }
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
