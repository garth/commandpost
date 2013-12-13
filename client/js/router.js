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
      this.route('view', { path: ':project_id' });
      this.route('edit', { path: ':project_id/edit' });
    });
  });
});
