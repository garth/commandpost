var _ = require('lodash');
var mongoose = require('mongoose');
var Board = mongoose.model('Board');
var Release = mongoose.model('Release');

module.exports = function (app, config, db) {

  app.pubsub.subscribe('/server/releases', function (message) {
    Release.find({ boardId: message.board.id }, function (err, releases) {
      if (err) {
        return app.pubsub.publishError('/releases', '/releases', {
          message: 'Failed to get releases',
          details: err,
          context: message
        });
      }
      var releaseList = _.map(releases, function (release) {
        return _.pick(release, ['id', 'boardId', 'version', 'description', 'createdOn']);
      });
      app.pubsub.publishToClient('/releases', { releases: releaseList }, message);
    });
  });

  app.pubsub.subscribe('/server/releases/create', function (message) {
    // create new release
    var release = new Release(message.release);
    release.createdByUserId = message.meta.user.id;
    release.createdOn = Date.now();

    // get the board
    Board.findById(message.release.boardId, function (err, board) {
      if (err || !board) {
        return app.pubsub.publishError('/releases/create', '/releases/create', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get board' : 'Board not found',
          details: err,
          context: message
        });
      }

      // move the cards from the board to the release
      _.forEach(message.release.cards, function (card) {
        var lane = board.lanes.id(card.laneId);
        if (lane) {
          card = lane.cards.id(card.id).remove();
          if (card) {
            release.cards.push(card);
          }
        }
      });

      // save the release
      release.save(function (err, release) {
        if (err) {
          return app.pubsub.publishError('/releases/create', '/releases/create', {
            message: 'Failed to create release',
            details: err,
            context: message
          });
        }

        // save the changes to the board
        board.save(function (err, board) {
          if (err) {
            return app.pubsub.publishError('/releases/create', '/releases/create', {
              message: 'Failed to update board',
              details: err,
              context: message
            });
          }

          // notify the client
          release = release.toJSON();
          app.pubsub.publishToClient('/releases/create', { release: release }, message);

          // notify all subscribers
          app.pubsub.publish('/boards/' + board.id + '/release', {
            action: 'create',
            release: release
          });
        });
      });
    });
  });

  app.pubsub.subscribe('/server/releases/get', function (message) {
    // find the release
    Release.findById(message.release.id, function (err, release) {
      if (err || !release) {
        return app.pubsub.publishError('/releases/get', '/releases/get', {
          errorCode: err ? 500 : 404,
          message: err ? 'Failed to get release' : 'Release not found',
          details: err,
          context: message
        });
      }
      // notify the client
      app.pubsub.publishToClient('/releases/get', { release: release.toJSON() }, message);
    });
  });

};
