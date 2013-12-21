var mongoose = require('mongoose');
var Lane = mongoose.model('Lane');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/lanes', authorise, function (req, res, next) {
    Lane.find(prepareQuery(req.query), function (err, lanes) {
      if (err) { return next(err); }
      res.send({ lanes: lanes });
    });
  });

  app.post('/api/lanes', authorise, function (req, res, next) {
    (new Lane(req.body.lane)).save(function (err, lane) {
      if (err) { return next(err); }
      recordHistory(req.user, 'lane', 'create', lane.toJSON());
      res.send({ lane: lane });
    });
  });

  app.get('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findById(req.params.id, function (err, lane) {
      if (err) { return next(err); }
      res.send(lane ? { lane: lane } : 404);
    });
  });

  app.put('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findById(req.params.id, function (err, lane) {
      if (err) { return next(err); }
      var oldValues = updateProperties(lane, req.body.lane, [
        'name', 'order', 'defaultIsVisible'
      ]);
      recordHistory(req.user, 'lane', 'update', lane.toJSON(), oldValues);
      lane.save(function (err, lane) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });

  app.del('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findById(req.params.id, function (err, lane) {
      if (err) { return next(err); }
      recordHistory(req.user, 'lane', 'delete', lane.toJSON());
      lane.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
