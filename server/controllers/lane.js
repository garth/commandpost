var mongoose = require('mongoose');
var Lane = mongoose.model('Lane');
var prepareQuery = require('../helpers/prepare-query');

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
    Lane.findByIdAndUpdate(req.params.id, req.body.lane, function(err, lane) {
      if (err) { return next(err); }
      res.send({});
    });
  });

  app.del('/api/lanes/:id', authorise, function (req, res, next) {
    Lane.findById(req.params.id, function (err, lane) {
      if (err) { return next(err); }
      lane.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
