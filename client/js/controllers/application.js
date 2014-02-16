App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    // ensure there is a session id before attempting to login
    if (!localStorage.sessionId) { return; }
    return App.pubsub.publishAwait('/session/get', function (message) {
      App.set('user', App.User.create(message.user));
    });
  },
  actions: {
    openModal: function(modalName, model) {
      this.controllerFor(modalName).set('model', model);
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});

App.ApplicationController = Ember.Controller.extend({

  // when a user enters the app unauthenticated, the transition
  // to where they are going is saved off so it can be retried
  // when they have logged in.
  savedTransition: null,

  actions: {
    signout: function() {
      App.pubsub.publishAwait('/session/delete', {
        sessionId: localStorage.sessionId
      }).then(function () {
        delete localStorage.sessionId;
        // reload the page to force drop all data
        document.location = '/';
      });
    }
  }
});
