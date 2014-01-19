App.ProfileRoute = Ember.Route.extend({
  model: function (params) {
    return App.get('user');
  }
});

App.ProfileController = Ember.ObjectController.extend({

  errorMessage: '',

  actions: {
    save: function () {
      var self = this;
      App.pubsub.publishAwait('/users/update', {
        user: this.get('model').getProperties('id', 'name', 'initials')
      }).then(function (message) {
        self.set('errorMessage', '');
        self.transitionToRoute('index');
      }, function (message) {
        self.set('errorMessage', message.message);
      });
    }
  }
});
