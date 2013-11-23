var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define card
  var Card = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number },
    createdByUser: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date },
    assignedToUser: { type: ObjectId, ref: 'User' },
    lane: { type: ObjectId, ref: 'Lane', required: true },
    order: { type: Number }
  }, config.schemaOptions);

  // register card with mongoose
  mongoose.model('Card', Card);
};
