App.ApplicationRoute = Ember.Route.extend({
  model: function(transition) {
    var store = this.get('store');
    return new Ember.RSVP.Promise(function(resolve, reject){
      // check if the user is already logged in
      if (localStorage.auth_token) {
        // lookup the current user info
        App.ajaxGet({
          url: '/api/session',
          headers: { 'x-auth-token': localStorage.auth_token }
        }).then(function (data) {
          // set the auth token header for all ajax requests
          $.ajaxSetup({
            headers: { 'x-auth-token': localStorage.auth_token }
          });
          // set the logged in user and organisation
          delete data.session;
          store.pushPayload('user', data);
          store.find('user', data.users[0].id).then(function (user) {
            App.set('user', user);
            resolve();
          });
        }, function (error) {
          console.log('autologin failed: ', error);
          delete localStorage.auth_token;
          resolve();
        });
      }
      else {
        resolve();
      }
    });
  }
});
