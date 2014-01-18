App.SigninRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SigninController = Ember.Controller.extend({
  needs: ['application'],

  errorMessage: '',
  name: '',
  password: '',

  actions: {
    signin: function() {
      var self = this;
      var applicationController = this.get('controllers.application');
      var message = this.getProperties('name', 'password');
      App.pubsub.publishAwait('/session/create', message).then(function (message) {
        self.setProperties({ errorMessage: '', name: '', password: '' });
        // login the user
        localStorage.sessionId = message.sessionId;
        App.set('user', App.User.create(message.user));
        // navigate
        var transition = applicationController.get('savedTransition');
        applicationController.set('savedTransition', null);
        // if the user was going somewhere, send them along, otherwise
        // default to root
        if (transition) {
          transition.retry();
        }
        else {
          self.transitionToRoute('index');
        }
      }, function (message) {
        self.set('errorMessage', message.message);
        Ember.$('#signin-view').effect('shake');
      });
    }
  }

});
