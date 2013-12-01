require('../models/user');

App.SignupRoute = Ember.Route.extend({

  redirect: function () {
    if (App.get('isLoggedIn')) {
      this.transitionTo('/', App.get('user.organisation'));
    }
  }

});


App.SignupController = Ember.Controller.extend({
  needs: ['application'],
  name: null,
  password: null,
  rememberMe: true,
  errorMessage: '',

  actions: {
    signin: function() {
      var user = this.getProperties('name', 'password', 'rememberMe');
      var store = this.get('store');
      var applicationController = this.get('controllers.application');
      var self = this;
      // try to create a login session
      App.ajaxPost({
        url: '/api/session',
        data: user
      }).then(function (data) {
        // add the user and organisation to the store
        store.pushPayload('user', data);
        // set the logged in user
        store.find('user', data.user.id).then(function (user) {
          App.set('user', user);
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
        });
      }, function (response) {
        self.set('errorMessage', App.getAjaxError(response));
        self.set('showFieldValidation', true);
        $('#signin-view').effect('shake');
      });
    }
  }

});
