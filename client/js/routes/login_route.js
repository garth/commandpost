App.LoginRoute = Ember.Route.extend({

  redirect: function () {
    if (App.get('isLoggedIn')) {
      this.transitionTo('/', App.get('user.organisation'));
    }
  }

});
