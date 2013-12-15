// load the config
var config = require('./config');

// define the app
App = Ember.Application.extend({
  // LOG_TRANSITIONS: true,
  // LOG_BINDINGS: true,
  // LOG_VIEW_LOOKUPS: true,
  // LOG_STACKTRACE_ON_DEPRECATION: true,
  // LOG_VERSION: true,
  // debugMode: true,

  user: null,

  config: config,

  isSignedIn: function () {
    return !!this.get('user');
  }.property('user')

}).create();

//load helpers
require('./helpers/helper-methods');

// prepare the data store
require('./store');

// the router
require('./router');

// components
require('./components/input-text');

// controllers
require('./controllers/application');
require('./controllers/index');
require('./controllers/signin');
require('./controllers/signup');
require('./controllers/board');
