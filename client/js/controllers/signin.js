App.SigninRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SigninController = App.Controller.extend({
  needs: ['application'],

  errorMessage: '',
  name: '',
  password: '',

  privateSubscriptions: {
    '/error/session': function (message) {
      this.set('errorMessage', message.message);
      Ember.$('#signin-view').effect('shake');
    },
    '/session/create': function (message) {
      // login the user
      localStorage.sessionId = message.sessionId;
      App.set('user', App.User.create(message.user));
      // navigate
      var applicationController = this.get('controllers.application');
      var transition = applicationController.get('savedTransition');
      applicationController.set('savedTransition', null);
      // if the user was going somewhere, send them along, otherwise
      // default to root
      if (transition) {
        transition.retry();
      }
      else {
        this.transitionToRoute('index');
      }
    }
  },

  actions: {
    signin: function() {
      App.pubsub.publish('/server/session/create', this.getProperties('name', 'password'));
    }
  }

});
