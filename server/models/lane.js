var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define lane
  var Lane = new Schema({
    board: { type: ObjectId, ref: 'Board', index: true, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, 'default': 0 }
  }, config.schemaOptions);

  Lane.pre('remove', function (next) {
    require('../helpers/delete-children')(this, 'Card', 'lane', next);
  });

  Lane.pre('init', function(next, card) {
    require('../helpers/insert-child-refs')(card, 'cards', 'Card', 'lane', next);
  });


  // register lane with mongoose
  mongoose.model('Lane', Lane);
};
