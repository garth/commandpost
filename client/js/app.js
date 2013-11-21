// load the config
var config = require('./config');

// define the app
App = Ember.Application.extend({
  LOG_TRANSITIONS: true,
  LOG_BINDINGS: true,
  LOG_VIEW_LOOKUPS: true,
  LOG_STACKTRACE_ON_DEPRECATION: true,
  LOG_VERSION: true,
  debugMode: true,

  user: null,

  isLoggedIn: function () {
    return !!this.get('user');
  }.property('user')
}).create();

//load helpers
require('./helpers/helper_methods');

// prepare the data store
require('./store');

// the router
require('./router');

// controllers
require('./controllers/application_controller');
require('./controllers/login_controller');
require('./controllers/signup_controller');
require('./controllers/project_controller');
