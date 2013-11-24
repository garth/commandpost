App.IndexRoute = Ember.Route.extend({

  beforeModel: function(transition) {
    var applicationController = this.controllerFor('application');

    if (!App.get('isLoggedIn')) {
      applicationController.set('savedTransition', transition);
      this.transitionTo('login');
    }
  }

});
