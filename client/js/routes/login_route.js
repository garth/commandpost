App.LoginRoute = Ember.Route.extend({
  redirect: function () {
    if (App.get('isLoggedIn')) {
      this.transitionTo('organisation', App.get('user.organisation'));
    }
  }
});
