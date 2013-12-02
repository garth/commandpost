require('../models/flash-message');
require('../models/user');

App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    var store = this.get('store');
    return new Ember.RSVP.Promise(function (resolve, reject) {

      // check if the user is already logged in
      if (App.readCookie('session')) {

        // lookup the current user info
        App.ajaxGet({ url: '/api/sessions' }).then(function (data) {

          // set the logged in user
          App.set('user', store.push('user', data.user));
          resolve();

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

  // array of flash messages to display
  flashMessages: Ember.A(),

  actions: {
    signout: function() {
      // ask the server to drop the session
      App.ajaxDelete({ url: '/api/sessions' }).then(function (data) {
        // reload the page to force drop all data
        document.location = '/';
      }, function (response) {
        this.flash('Singout Failed');
        console.log('Singout Failed', response);
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
