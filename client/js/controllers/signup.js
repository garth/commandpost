require('../models/user');

App.SignupRoute = Ember.Route.extend({});

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
