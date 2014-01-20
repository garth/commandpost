var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define card type
  var CardType = new Schema({
    board: { type: ObjectId, ref: 'Board', index: true, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    pointScale: { type: String },
    priority: { type: Number, required: true, 'default': 0 },
    isHidden: { type: Boolean, required: true, 'default': false }
  });

  // register card type with mongoose
  mongoose.model('CardType', CardType);
};
