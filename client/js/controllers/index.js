App.IndexRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    var applicationController = this.controllerFor('application');

    if (!App.get('isSignedIn')) {
      applicationController.set('savedTransition', transition);
      this.transitionTo('signin');
    }
  }

});

App.IndexIndexRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    this.transitionTo('boards');
  }

});
