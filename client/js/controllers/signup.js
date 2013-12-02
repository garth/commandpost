require('../models/user');

App.SignupRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SignupController = Ember.ObjectController.extend({

  errorMessage: '',
  name: '',
  password: '',

  actions: {
    signup: function() {
      var self = this;
      App.ajaxPost({
        url: '/api/users',
        data: { user: this.getProperties('name', 'password') }
      }).then(function (data) {
        if (data.error) {
          self.set('errorMessage', data.error);
        }
        else {
          self.set('errorMessage', '');
          self.set('name', '');
          self.set('password', '');
          self.transitionToRoute('signin');
        }
      }, function (response) {
        self.set('errorMessage', App.getAjaxError(response));
      });
    }
  }
});
