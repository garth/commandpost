var mongoose = require('mongoose');
var Card = mongoose.model('Card');

module.exports = function (app, config, db) {

  app.get('/api/cards', function (req, res, next) {
    Card.find(req.params || {}, function (err, cards) {
      if (err) { return next(err); }
      res.send({ cards: cards });
    });
  });

  app.post('/api/cards', function (req, res, next) {
    (new Card(req.body.card)).save(function (err, card) {
      if (err) { return next(err); }
      res.send({ card: card.toJSON() });
    });
  });

  app.get('/api/cards/:id', function (req, res, next) {
    Card.findById(req.params.id, function (err, card) {
      if (err) { return next(err); }
      res.send({ card: card });
    });
  });

  app.put('/api/cards/:id', function (req, res, next) {
    Card.findByIdAndUpdate(req.params.id, req.body.card, function(err, card) {
      if (err) { return next(err); }
      res.end();
    });
  });

  app.del('/api/cards/:id', function (req, res, next) {
    Card.findByIdAndRemove(req.params.id, function(err, card) {
      if (err) { return next(err); }
      res.end();
    });
  });
};
