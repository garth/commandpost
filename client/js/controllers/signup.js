App.SignupRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SignupController = App.Controller.extend({

  errorMessage: '',

  name: '',
  initials: '',
  login: '',
  password: '',

  privateSubscriptions: {
    '/error/users/create': function (message) {
      this.set('errorMessage', message.message);
    },
    '/users/create': function (message) {
      this.set('errorMessage', '');
      this.setProperties({ name: '', initials: '', login: '', password: '' });
      this.transitionToRoute('signin');
    }
  },

  actions: {
    signup: function() {
      App.pubsub.publish('/server/users/create',
        { user: this.getProperties('name', 'initials', 'login', 'password') });
    }
  }
});
