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

  isConnected: true,
  user: null,
  users: null,

  config: config,

  isSignedIn: function () {
    return !!this.get('user');
  }.property('user')

}).create();

//load helpers
require('./helpers/helper-methods');
App.pubsub = require('./helpers/pubsub')(
  App, window.Faye, Ember.RSVP, '/pubsub', App.createUuid(), localStorage);
require('./helpers/controller');

//load models
require('./models/board');
require('./models/card-type');
require('./models/card');
require('./models/comment');
require('./models/lane');
require('./models/user');

// the router
require('./router');

// components
require('./components/card-icon');
require('./components/input-tags');
require('./components/input-text');
require('./components/sortable-list');

// controllers
require('./controllers/application');
require('./controllers/index');
require('./controllers/error');
require('./controllers/signin');
require('./controllers/signup');
require('./controllers/boards-index');
require('./controllers/boards-view');
require('./controllers/boards-edit');
require('./controllers/lane');
require('./controllers/card');
