var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define board
  var Board = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    defaultCardTypeId: { type: ObjectId },
    createdByUserId: { type: ObjectId, required: true },
    createdOn: { type: Date, required: true, 'default': Date.now },
    lanes: [new Schema({
      name: { type: String, required: true },
      order: { type: Number, required: true, 'default': 0 },
      defaultIsVisible: { type: Boolean, required: true, 'default': true },
      cards: [new Schema({
        cardTypeId: { type: ObjectId, required: true },
        title: { type: String, required: true },
        description: { type: String },
        points: { type: Number },
        tags: { type: [String], 'default': [] },
        assignedToUserId: { type: ObjectId, index: true },
        order: { type: Number, required: true, 'default': 0 },
        history: [new Schema({
          userId: { type: ObjectId, required: true },
          date: { type: Date, required: true, 'default': Date.now },
          laneName: { type: String, required: true },
          action: { type: String, required: true }
        }, config.schemaOptions)],
        comments: [new Schema({
          text: { type: String, required: true },
          userId: { type: ObjectId, required: true },
          createdOn: { type: Date, required: true, 'default': Date.now }
        }, config.schemaOptions)]
      }, config.schemaOptions)]
    }, config.schemaOptions)],
    cardTypes: [new Schema({
      name: { type: String, required: true },
      icon: { type: String, required: true },
      pointScale: { type: String },
      priority: { type: Number, required: true, 'default': 0 },
      isHidden: { type: Boolean, required: true, 'default': false }
    }, config.schemaOptions)]
  }, config.schemaOptions);

  // register board with mongoose
  mongoose.model('Board', Board);
};
