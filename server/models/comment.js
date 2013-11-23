var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define comment
  var Comment = new Schema({
    card: { type: ObjectId, ref: 'Card', index: true, required: true },
    text: { type: String, required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, required: true, 'default': Date.now }
  }, config.schemaOptions);

  // register comment with mongoose
  mongoose.model('Comment', Comment);
};
