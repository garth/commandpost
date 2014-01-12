App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    return new Ember.RSVP.Promise(function (resolve, reject) {

      // check if the user is already logged in
      if (!localStorage.sessionId) {
        return resolve();
      }

      var subscriptionGet, subscriptionError, timeout;

      var done = function () {
        clearTimeout(timeout);
        subscriptionGet.cancel();
        subscriptionError.cancel();
        resolve();
      };

      timeout = setTimeout(function () {
        App.flash.error('Auto login timed out');
        done();
      }, 10 * 1000);

      subscriptionGet = App.pubsub.subscribeToClient('/session/get', function (message) {
        App.set('user', App.User.create(message.user));
        done();
      });

      subscriptionError = App.pubsub.subscribeToClient('/error/session/get', function (message) {
        console.log('autologin failed:', message);
        done();
      });

      App.pubsub.publish('/server/session/get', {});

    });
  }
});


App.ApplicationController = Ember.Controller.extend({

  // when a user enters the app unauthenticated, the transition
  // to where they are going is saved off so it can be retried
  // when they have logged in.
  savedTransition: null,

  actions: {
    signout: function() {

      var subscription = App.pubsub.subscribeToClient('/session/destroy', function (message) {
        subscription.cancel();
        delete localStorage.sessionId;
        // reload the page to force drop all data
        document.location = '/';
      });

      // ask the server to drop the session
      App.pubsub.publish('/server/session/destroy', { sessionId: localStorage.sessionId });
    }
  }
});
