require('../models/flash_message');
require('../models/user');

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
