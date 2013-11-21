require('../models/user');

App.SignupController = Ember.ObjectController.extend({

  errorMessage: '',

  actions: {
    signup: function() {
      if (this.get('isFormValid')) {
        var self = this;
        var user = this.get('model').getProperties('name', 'password');
        App.ajaxPost({
          url: '/api/users',
          data: { user: user }
        }).then(function (data) {
          if (data.error) {
            self.set('errorMessage', data.error);
          }
          else {
            self.set('errorMessage', '');
            self.transitionToRoute('login');
          }
        }, function (response) {
          self.set('errorMessage', App.getAjaxError(response));
        });
      }
      else {
        this.set('errorMessage', 'Please correct the indicated fields above');
      }
    }
  }
});
