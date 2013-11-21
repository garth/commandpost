var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define card
  var Card = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number },
    createdByUserId: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date },
    assignedToUserId: { type: ObjectId, ref: 'User' },
    laneId: { type: ObjectId, ref: 'Lane', required: true },
    order: { type: Number }
  }, config.schemaOptions);

  // register card with mongoose
  mongoose.model('Card', Card);
};
