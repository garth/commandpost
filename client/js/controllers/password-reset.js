App.PasswordResetRoute = Ember.Route.extend({
  model: function (params) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var users = App.get('users');
      if (users) {
        resolve(App.userIndex[params.user_id]);
      }
      else {
        var self = this;
        var observer = function () {
          App.removeObserver('users', self, observer);
          resolve(App.userIndex[params.user_id]);
        };
        App.addObserver('users', this, observer);
      }
    });
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('password', '');
  }
});

App.PasswordResetController = Ember.ObjectController.extend({
  password: null,
  errorMessage: null,

  actions: {
    resetPassword: function () {
      var password = this.get('password');
      var userId = this.get('model.id');
      this.set('errorMessage', '');

      if (!password) {
        this.set('errorMessage', 'Please enter a password');
      }
      else {
        var self = this;
        App.pubsub.publishAwait('/users/reset-password', {
          user: { id: userId, password: password }
        }).then(function (message) {
          App.flash.success('Password for ' + self.get('model.name') + ' has been updated');
          self.transitionToRoute('users');
        });
      }
    }
  }
});
