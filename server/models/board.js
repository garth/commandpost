var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define board
  var Board = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    createdByUser: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, required: true, 'default': Date.now }
  }, config.schemaOptions);

  Board.pre('remove', function (next) {
    require('../helpers/delete-children')(this, 'Lane', 'board', next);
  });

  Board.pre('init', function(next, board) {
    require('../helpers/insert-child-refs')(board, 'lanes', 'Lane', 'board', next);
  });

  // register board with mongoose
  mongoose.model('Board', Board);
};
