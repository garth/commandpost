var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define lane
  var Lane = new Schema({
    board: { type: ObjectId, ref: 'Board', index: true, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, 'default': 0 },
    defaultIsVisible: { type: Boolean, required: true, 'default': true }
  });

  // register lane with mongoose
  mongoose.model('Lane', Lane);
};
