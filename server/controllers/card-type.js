var mongoose = require('mongoose');
//var CardType = mongoose.model('CardType');
//var updateProperties = require('../helpers/update-properties');
//var recordHistory = require('../helpers/history').record;

module.exports = function (app, config, db) {

  // var authorise = require('../authorise')(config);

  // app.get('/api/cardTypes', authorise, function (req, res, next) {
  //   CardType.find(prepareQuery(req.query), function (err, cardTypes) {
  //     if (err) { return next(err); }
  //     res.send({ cardTypes: cardTypes });
  //   });
  // });

  // app.post('/api/cardTypes', authorise, function (req, res, next) {
  //   var cardType = req.body.cardType;
  //   (new CardType(cardType)).save(function (err, cardType) {
  //     if (err) { return next(err); }
  //     recordHistory(req.user, 'cardType', 'create', cardType.toJSON());
  //     res.send({ cardType: cardType });
  //   });
  // });

  // app.get('/api/cardTypes/:id', authorise, function (req, res, next) {
  //   CardType.findById(req.params.id, function (err, cardType) {
  //     if (err) { return next(err); }
  //     res.send(cardType ? { cardType: cardType } : 404);
  //   });
  // });

  // app.put('/api/cardTypes/:id', authorise, function (req, res, next) {
  //   CardType.findById(req.params.id, function (err, cardType) {
  //     if (err) { return next(err); }
  //     var oldValues = updateProperties(cardType, req.body.cardType, [
  //       'board', 'name', 'icon', 'pointScale', 'priority', 'isHidden'
  //     ]);
  //     recordHistory(req.user, 'cardType', 'update', cardType.toJSON(), oldValues);
  //     cardType.save(function (err, cardType) {
  //       if (err) { return next(err); }
  //       res.send({});
  //     });
  //   });
  // });

  // app.del('/api/cardTypes/:id', authorise, function (req, res, next) {
  //   CardType.findById(req.params.id, function (err, cardType) {
  //     if (err) { return next(err); }
  //     recordHistory(req.user, 'cardType', 'delete', cardType.toJSON());
  //     cardType.remove(function (err) {
  //       if (err) { return next(err); }
  //       res.send({});
  //     });
  //   });
  // });
};
