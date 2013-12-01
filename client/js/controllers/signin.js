require('../models/user');

App.SignupRoute = Ember.Route.extend({
  redirect: function () {
    // if the user is already signed in send the along
    if (App.get('isSignedIn')) {
      this.transitionTo('index');
    }
  }
});

App.SignupController = Ember.Controller.extend({
  needs: ['application'],

  errorMessage: '',
  name: '',
  password: '',

  actions: {
    signin: function() {
      var user = this.getProperties('name', 'password');
      var store = this.get('store');
      var applicationController = this.get('controllers.application');
      var self = this;
      // try to create a login session
      App.ajaxPost({
        url: '/api/session',
        data: user
      }).then(function (data) {
        // set the logged in user
        App.set('user', store.push('user', data.user));
        // navigate
        var transition = applicationController.get('savedTransition');
        applicationController.set('savedTransition', null);
        // if the user was going somewhere, send them along, otherwise
        // default to root
        if (transition) {
          transition.retry();
        } else {
          self.transitionToRoute('index');
        }
      }, function (response) {
        self.set('errorMessage', App.getAjaxError(response));
        $('#signin-view').effect('shake');
      });
    }
  }

});
