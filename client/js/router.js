require('./routes/route');
require('./routes/application_route');
require('./routes/login_route');
require('./routes/signup_route');
require('./routes/index_route');

App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  this.resource('login');
  this.resource('signup');
  this.resource('index', { path: '/' });
  this.resource('project', { path: '/projects/:project_id' });
});
