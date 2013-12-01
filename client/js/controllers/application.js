require('../models/flash-message');
require('../models/user');

App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    var store = this.get('store');
    return new Ember.RSVP.Promise(function (resolve, reject) {

      // check if the user is already logged in
      if (App.readCookie('session')) {

        // lookup the current user info
        App.ajaxGet({ url: '/api/session' }).then(function (data) {

          // set the logged in user
          store.pushPayload('user', data);
          store.find('user', data.user.id).then(function (user) {
            App.set('user', user);
            resolve();
          });

        }, function (error) {
          console.log('autologin failed: ', error);
          resolve();
        });
      }
      else {
        resolve();
      }
    });
  }
});


App.ApplicationController = Ember.Controller.extend({
  // when a user enters the app unauthenticated, the transition
  // to where they are going is saved off so it can be retried
  // when they have logged in.
  savedTransition: null,
  flashMessages: Ember.A(),

  actions: {
    logout: function() {
      // ask the server to drop the session
      App.ajaxDelete({ url: '/api/session' }).then(function (data) {
        // remove the auth token from the browser
        delete localStorage.auth_token;
        // reload the page to force drop all data
        document.location = '/';
      }, function (response) {
        console.log('session destroy failed');
      });
    }
  },

  // flashMessage should contein type and message
  flash: function (flashMessage) {
    var self = this;
    setTimeout(function () {
      self.get('flashMessages').pushObject(App.FlashMessage.create(flashMessage));
    }, 1);
  },

  clearFlash: function () {
    this.set('flashMessages', Ember.A());
  }
});
