App.Router = Ember.Router.extend({
  location: 'history'
});

App.Router.map(function() {
  this.route('signin');
  this.route('signup');
  //everything under index requires authentication
  this.resource('index', { path: '/' }, function () {
    this.resource('boards', function () {
      this.route('new');
      this.resource('board', { path: ':board_id' }, function () {
        this.route('view', { path: '/' });
        this.route('edit', { path: 'edit' });
      });
    });
  });
});
