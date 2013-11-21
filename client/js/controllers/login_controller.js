require('../models/user');

App.LoginController = Ember.Controller.extend({
  needs: ['application'],
  name: null,
  password: null,
  rememberMe: true,
  errorMessage: '',

  actions: {
    login: function() {
      var user = this.getProperties('name', 'password', 'rememberMe');
      var store = this.get('store');
      var applicationController = this.get('controllers.application');
      var self = this;
      // try to create a login session
      App.ajaxPost({
        url: '/api/session',
        data: user
      }).then(function (data) {
        // get the auth token provided
        var auth_token = data.session.auth_token;
        // remove the session from the data (session no defined as ember data obj)
        delete data.session;
        // if remember_me, store auth token in the browser
        if (user.rememberMe) {
          localStorage.auth_token = auth_token;
        }
        else {
          delete localStorage.auth_token;
        }
        // add the auth token to all ajax calls
        $.ajaxSetup({
          headers: { 'x-auth-token': auth_token }
        });
        // add the user and organisation to the store
        store.pushPayload('user', data);
        // set the logged in user
        store.find('user', data.users[0].id).then(function (user) {
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
        $('#login-view').effect('shake');
      });
    }
  }

});
