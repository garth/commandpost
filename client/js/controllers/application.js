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
