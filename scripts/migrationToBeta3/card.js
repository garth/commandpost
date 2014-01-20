var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define card
  var Card = new Schema({
    cardType: { type: ObjectId, ref: 'CardType', required: true },
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number },
    tags: { type: [String], 'default': [] },
    createdByUser: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date, required: true, 'default': Date.now },
    assignedToUser: { type: ObjectId, ref: 'User', index: true },
    lane: { type: ObjectId, ref: 'Lane', index: true, required: true },
    order: { type: Number, required: true, 'default': 0 }
  });

  // register card with mongoose
  mongoose.model('Card', Card);
};
