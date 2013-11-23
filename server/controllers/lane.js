var mongoose = require('mongoose');
var Lane = mongoose.model('Lane');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/lanes', authorise, function (req, res, next) {
    Lane.find(req.params || {}, function (err, lanes) {
      if (err) { return next(err); }
      res.send({ lanes: lanes });
    });
  });

  app.post('/api/lanes', authorise, function (req, res, next) {
    (new Lane(req.body.lane)).save(function (err, lane) {
      if (err) { return next(err); }
      res.send({ lane: lane.toJSON() });
    });
  });

  app.get('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findById(req.params.id, function (err, lane) {
      if (err) { return next(err); }
      res.send({ lane: lane });
    });
  });

  app.put('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findByIdAndUpdate(req.params.id, req.body.lane, function(err, lane) {
      if (err) { return next(err); }
      res.end();
    });
  });

  app.del('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findByIdAndRemove(req.params.id, function(err, lane) {
      if (err) { return next(err); }
      res.end();
    });
  });
};
