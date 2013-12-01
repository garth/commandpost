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
  this.route('index', { path: '/' });
  this.resource('project', { path: '/projects/:project_id' });
});
