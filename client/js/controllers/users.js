App.UsersRoute = Ember.Route.extend({
  model: function () {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var users = App.get('users');
      if (users) {
        resolve(users);
      }
      else {
        var self = this;
        var observer = function () {
          App.removeObserver('users', self, observer);
          resolve(App.get('users'));
        };
        App.addObserver('users', this, observer);
      }
    });
  }
});

App.UsersController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  itemController: 'user'
});

App.UserController = Ember.ObjectController.extend({
  roleChanged: function () {
    if (!this.get('model.isCurrent') && App.get('user.isAdmin')) {
      App.pubsub.publish('/server/users/update', {
        user: this.get('model').getProperties('id', 'role')
      });
    }
  }.observes('model.role')
});
