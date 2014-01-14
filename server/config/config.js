var _ = require('underscore');
var path = require('path');

var clientConfig = require('../../client/js/config');

var transformDates = function (obj) {
  for (var prop in obj) {
    var val = obj[prop];
    if (val instanceof Date && !isNaN(val.valueOf())) {
      obj[prop] = val.toJSON();
    }
    else if (typeof val === 'object') {
      transformDates(val);
    }
  }
};

module.exports = function (env) {

  var config = {

    // current environment
    env: env || process.env.NODE_ENV || 'development',

    // root dir of app
    root: path.join(__dirname, '../..'),

    // web server port
    port: process.env.PORT || 3000,

    // mongo db schema options
    schemaOptions: {
      toJSON: {
        virtuals: true,
        transform: function (doc, ret, options) {
          delete ret.__v;
          delete ret._id;
          delete ret.password;
          delete ret.login;
          transformDates(ret);
        }
      }
    },

    // sessions expire after 14 days
    sessionTtl: 1000 * 60 * 60 * 24 * 14,

    // environment specific overrides
    development: {
      db: 'mongodb://localhost/commandpost-development'
    },

    test: {
      db: 'mongodb://localhost/commandpost-test',
      port: process.env.PORT || 3001
    },

    production: {
      db: 'mongodb://localhost/commandpost-production'
    }
  };

  // env flags
  config.isProduction = config.env === 'production';
  config.isTest = config.env === 'test';
  config.isDevelopment = config.env === 'development';

  return _.extend({}, clientConfig, config, config[config.env]);

};
