App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  this.route('signin');
  this.route('signup');
  //everything under index requires authentication
  this.resource('index', { path: '/' }, function () {
    this.resource('profile');
    this.resource('users');
    this.resource('password-reset', { path: 'password-reset/:user_id' });
    this.resource('boards', function () {
      this.route('new');
      this.resource('board', { path: ':board_id' }, function () {
        this.route('view', { path: '/' });
        this.route('edit', { path: 'edit' });
        this.resource('releases', function () {
          this.route('new');
          this.route('view', { path: ':release_id' });
        });
      });
    });
  });
});
