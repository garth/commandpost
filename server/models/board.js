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
    lanes: [{
      name: { type: String, required: true },
      order: { type: Number, required: true, 'default': 0 },
      defaultIsVisible: { type: Boolean, required: true, 'default': true },
      cards: [{
        cardTypeId: { type: ObjectId, required: true },
        title: { type: String, required: true },
        description: { type: String },
        points: { type: Number },
        tags: { type: [String], 'default': [] },
        createdByUserId: { type: ObjectId, required: true },
        createdOn: { type: Date, required: true, 'default': Date.now },
        assignedToUserId: { type: ObjectId, index: true },
        order: { type: Number, required: true, 'default': 0 },
        comments: [{
          text: { type: String, required: true },
          userId: { type: ObjectId, required: true },
          createdOn: { type: Date, required: true, 'default': Date.now }
        }]
      }]
    }],
    cardTypes: [{
      name: { type: String, required: true },
      icon: { type: String, required: true },
      pointScale: { type: String },
      priority: { type: Number, required: true, 'default': 0 },
      isHidden: { type: Boolean, required: true, 'default': false }
    }]
  }, config.schemaOptions);

  // register board with mongoose
  mongoose.model('Board', Board);
};
