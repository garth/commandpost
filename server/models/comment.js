var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define comment
  var Comment = new Schema({
    cardId: { type: ObjectId, ref: 'Card', required: true },
    text: { type: String, required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, required: true }
  }, config.schemaOptions);

  // register comment with mongoose
  mongoose.model('Comment', Comment);
};
