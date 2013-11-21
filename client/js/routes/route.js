Ember.Route.reopen({
  // close any open flash messages before a route loads
  activate: function () {
    this.controllerFor('application').clearFlash();
  }
});
