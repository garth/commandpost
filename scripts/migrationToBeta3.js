var _ = require('lodash');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var config = require('../server/config/config')('production');
var RSVP = require('rsvp');
var Promise = RSVP.Promise;

// connect to the database
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function (error) {
  console.log(error);
  throw new Error('unable to connect to database at ' + config.db);
});

// load the models
var modelsPath = path.join(__dirname, 'migrationToBeta3');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.match(/\.js/)) {
    require(path.join(modelsPath, file))(config, db);
  }
});
var Board = mongoose.model('Board');
var CardType = mongoose.model('CardType');
var Card = mongoose.model('Card');
var Lane = mongoose.model('Lane');
var User = mongoose.model('User');

console.log('Upgrading production database: ' + config.db);

User.find({}, function (err, users) {
  if (err) { return console.log(err); }

  var i = 0;
  console.log(users);
  _.forEach(users, function (user) {
    if (!user.login) {
      console.log('Transforming user: ' + user.name);
      user.login = user.name;
      user.initials = user.name[0] + (++i);
      console.log(user);
      user.save(function (err) {
        if (err) { return console.log(err); }
      });
    }
    else {
      console.log(user.name + ' has already been transformed');
    }
  });
});

var boardPromises = [];

Board.find({}, function (err, boards) {
  if (err) { return console.log(err); }

  if (!boards.length) {
    console.log('No boards found');
  }

  _.forEach(boards, function (board) {

    // check that this board hasn't already been converted
    if (board.cardTypes.length || board.lanes.length) {
      return console.log(board.name + ' has already been transformed');
    }

    console.log('Transforming board: ' + board.name);

    // fix board fields
    board.defaultCardTypeId = board.defaultCardType;
    board.createdByUserId = board.createdByUser;

    boardPromises.push(new Promise(function (resolveBoard, reject) {

      // attach card types
      CardType.find({ board: board.id }, function (err, cardTypes) {
        if (err) { return console.log(err); }

        _.forEach(cardTypes, function (cardType) {

          console.log('Transforming board: ' + board.name + ', cardType: ' + cardType.name);

          board.cardTypes.push(cardType.toJSON());
        });

        // attach lanes
        Lane.find({ board: board.id }, function (err, lanes) {
          if (err) { return console.log(err); }

          var lanePromises = [];

          _.forEach(lanes, function (lane) {

            console.log('Transforming board: ' + board.name + ', lane: ' + lane.name);

            lane = lane.toJSON();
            lane.type = lane.defaultIsVisible ? 'queue' : 'hidden';
            lane = board.lanes[board.lanes.push(lane) - 1];

            lanePromises.push(new Promise(function (resolveLane, reject) {

              // attach cards
              Card.find({ lane: lane.id }, function (err, cards) {
                if (err) { return console.log(err); }

                _.forEach(cards, function (card) {
                  console.log('Transforming board: ' + board.name + ', lane: ' +
                    lane.name + ', card: ' + card.title);

                  card = card.toJSON();
                  card.cardTypeId = card.cardType;
                  card.createdByUserId = card.createdByUser;
                  card.assignedToUserId = card.assignedToUser;
                  lane.cards.push(card);

                });

                resolveLane();
              });
            }));
          });

          RSVP.all(lanePromises).then(function () {
            //console.log('Save board: ', board);

            board.save(function(err) {
              if (err) { return console.log(err); }
              resolveBoard();
            });

          });
        });
      });
    }));
  });

  RSVP.all(boardPromises).then(function () {
    db.close();
  });
});
