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

  init: function () {
    this._super();
    var self = this;
    // server sends error
    this.subscriptionError = App.pubsub.subscribeToClient('/error/session', function (message) {
      self.set('errorMessage', message.message);
      Ember.$('#signin-view').effect('shake');
    });
    // server sends success
    this.subscriptionCreate = App.pubsub.subscribeToClient('/session/create', function (message) {
      // login the user
      localStorage.sessionId = message.sessionId;
      App.set('user', App.User.create(message.user));
      // navigate
      var applicationController = self.get('controllers.application');
      var transition = applicationController.get('savedTransition');
      applicationController.set('savedTransition', null);
      // if the user was going somewhere, send them along, otherwise
      // default to root
      if (transition) {
        transition.retry();
      } else {
        self.transitionToRoute('index');
      }
    });
  },

  willDestroy: function () {
    this._super();
    this.subscriptionError.cancel();
    this.subscriptionCreate.cancel();
  },



  actions: {
    signin: function() {
      // try to create a login session
      App.pubsub.publish('/server/session/create', this.getProperties('name', 'password'));
    }
  }

});
