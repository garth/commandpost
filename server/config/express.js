var express = require('express');

module.exports = function(app, config) {
  app.use(express.compress());
  app.use(express.static(config.root + '/public'));
  if (!config.isProduction) {
    app.use('/mocha', express.static(config.root + '/node_modules/mocha'));
    app.use('/chai', express.static(config.root + '/node_modules/chai'));
    app.use('/test', express.static(config.root + '/test/client'));
  }
  app.set('port', config.port);
  app.set('views', config.root + '/server/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.favicon(config.root + '/public/favicon.ico'));
  if (config.isDevelopment) {
    app.use(express.logger('dev'));
  }
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('../default'));
};
