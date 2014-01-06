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
  }, config.schemaOptions);

  Card.pre('remove', function (next) {
    require('../helpers/delete-children')(this, 'Comment', 'card', next);
  });

  Card.pre('init', function(next, card) {
    require('../helpers/insert-child-refs')(card, 'comments', 'Comment', 'card', next);
  });

  // register card with mongoose
  mongoose.model('Card', Card);
};
