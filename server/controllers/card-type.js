var mongoose = require('mongoose');
var CardType = mongoose.model('CardType');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/cardtypes', authorise, function (req, res, next) {
    CardType.find(prepareQuery(req.query), function (err, cardTypes) {
      if (err) { return next(err); }
      res.send({ cardTypes: cardTypes });
    });
  });

  app.post('/api/cardtypes', authorise, function (req, res, next) {
    var cardType = req.body.cardType;
    (new CardType(cardType)).save(function (err, cardType) {
      if (err) { return next(err); }
      recordHistory(req.user, 'cardType', 'create', cardType.toJSON());
      res.send({ cardType: cardType });
    });
  });

  app.get('/api/cardtypes/:id', authorise, function (req, res, next) {
    CardType.findById(req.params.id, function (err, cardType) {
      if (err) { return next(err); }
      res.send(cardType ? { cardType: cardType } : 404);
    });
  });

  app.put('/api/cardtypes/:id', authorise, function (req, res, next) {
    CardType.findById(req.params.id, function (err, cardType) {
      if (err) { return next(err); }
      var oldValues = updateProperties(cardType, req.body.cardType, [
        'board', 'name', 'icon', 'pointScale', 'priority'
      ]);
      recordHistory(req.user, 'cardType', 'update', cardType.toJSON(), oldValues);
      cardType.save(function (err, cardType) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });

  app.del('/api/cardtypes/:id', authorise, function (req, res, next) {
    CardType.findById(req.params.id, function (err, cardType) {
      if (err) { return next(err); }
      recordHistory(req.user, 'cardType', 'delete', cardType.toJSON());
      cardType.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
