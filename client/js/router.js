Ember.Route.reopen({
  // close any open flash messages before a route loads
  activate: function () {
    this.controllerFor('application').clearFlash();
  }
});

App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  this.route('signin');
  this.route('signup');
  //everything under index requires authentication
  this.resource('index', { path: '/' }, function () {
    this.resource('projects', function () {
      this.route('new');
      this.route('edit', { path: ':project_id' });
    });
  });
});
