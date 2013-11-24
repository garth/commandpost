App.ApplicationRoute = Ember.Route.extend({
  model: function () {
    var store = this.get('store');
    return new Ember.RSVP.Promise(function (resolve, reject) {

      // check if the user is already logged in
      if (App.readCookie('session')) {

        // lookup the current user info
        App.ajaxGet({ url: '/api/session' }).then(function (data) {

          // set the logged in user
          store.pushPayload('user', data);
          store.find('user', data.user.id).then(function (user) {
            App.set('user', user);
            resolve();
          });

        }, function (error) {
          console.log('autologin failed: ', error);
          resolve();
        });
      }
      else {
        resolve();
      }
    });
  }
});
