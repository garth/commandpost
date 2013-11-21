App.signup = null;

App.SignupRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    if (!App.signup) {
      var organisation = store.createRecord('organisation');
      var user = store.createRecord('user', { organisation: organisation });
      App.signup = store.createRecord('signup', { id: 'new', user: user });
    }
    return App.signup;
  }
});
