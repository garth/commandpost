App.SignupRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SignupController = Ember.Controller.extend({

  errorMessage: '',
  name: '',
  initials: '',
  login: '',
  password: '',

  actions: {
    signup: function() {
      var self = this;
      App.pubsub.publishAwait('/users/create', {
        user: this.getProperties('name', 'initials', 'login', 'password')
      }).then(function (message) {
        self.setProperties({ errorMessage: '', name: '', initials: '', login: '', password: '' });
        self.transitionToRoute('signin');
      }, function (message) {
        self.set('errorMessage', message.message);
      });
    }
  }
});
