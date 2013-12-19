var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var RSVP = require('rsvp');
var Promise = RSVP.Promise;
var insertChildRefs = require('../helpers/insert-child-refs');
var deleteChildren = require('../helpers/delete-children');

module.exports = function (config, db) {

  // define board
  var Board = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    defaultCardType: { type: ObjectId, ref: 'CardType' },
    createdByUser: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, required: true, 'default': Date.now }
  }, config.schemaOptions);

  Board.pre('remove', function (next) {
    var self = this;
    var promises = [];
    promises.push(new Promise(function (resolve, reject) {
      deleteChildren(self, 'Lane', 'board', function (err) {
        err ? reject(err) : resolve();
      });
    }));
    promises.push(new Promise(function (resolve, reject) {
      deleteChildren(self, 'CardType', 'board', function (err) {
        err ? reject(err) : resolve();
      });
    }));
    RSVP.all(promises).then(function () { next(); }, next);
  });

  Board.pre('init', function(next, board) {
    var promises = [];
    promises.push(new Promise(function (resolve, reject) {
      insertChildRefs(board, 'lanes', 'Lane', 'board', function (err) {
        err ? reject(err) : resolve();
      });
    }));
    promises.push(new Promise(function (resolve, reject) {
      insertChildRefs(board, 'cardTypes', 'CardType', 'board', function (err) {
        err ? reject(err) : resolve();
      });
    }));
    RSVP.all(promises).then(function () { next(); }, next);
  });

  // register board with mongoose
  mongoose.model('Board', Board);
};
