var _ = require('underscore');
var path = require('path');

var clientConfig = require('../../client/js/config');

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
          if (ret.password) {
            delete ret.passowrd;
          }
        }
      }
    },

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

  return _.extend({}, clientConfig, config, config[config.env]);

};
