var mongoose = require('mongoose');
var Card = mongoose.model('Card');
var prepareQuery = require('../helpers/prepare-query');
var updateProperties = require('../helpers/update-properties');
var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/cards', authorise, function (req, res, next) {
    Card.find(prepareQuery(req.query), function (err, cards) {
      if (err) { return next(err); }
      res.send({ cards: cards });
    });
  });

  app.post('/api/cards', authorise, function (req, res, next) {
    var card = req.body.card;
    card.createdByUser = req.user.id;
    card.createdOn = Date.now();
    (new Card(card)).save(function (err, card) {
      if (err) { return next(err); }
      recordHistory(req.user, 'card', 'create', card.toJSON());
      res.send({ card: card });
    });
  });

  app.get('/api/cards/:id', authorise, function (req, res, next) {
    Card.findById(req.params.id, function (err, card) {
      if (err) { return next(err); }
      res.send(card ? { card: card } : 404);
    });
  });

  app.put('/api/cards/:id', authorise, function (req, res, next) {
    Card.findById(req.params.id, function (err, card) {
      if (err) { return next(err); }
      var oldValues = updateProperties(card, req.body.card, [
        'title', 'description', 'points', 'assignedToUser', 'lane', 'order'
      ]);
      recordHistory(req.user, 'card', 'update', card.toJSON(), oldValues);
      card.save(function (err, card) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });

  app.del('/api/cards/:id', authorise, function (req, res, next) {
    Card.findById(req.params.id, function (err, card) {
      if (err) { return next(err); }
      recordHistory(req.user, 'card', 'delete', card.toJSON());
      card.remove(function (err) {
        if (err) { return next(err); }
        res.send({});
      });
    });
  });
};
