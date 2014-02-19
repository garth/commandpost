var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define release
  var Release = new Schema({
    boardId: { type: ObjectId, required: true },
    version: { type: String, required: true },
    description: { type: String },
    createdByUserId: { type: ObjectId, required: true },
    createdOn: { type: Date, required: true, 'default': Date.now },
    cards: [new Schema({
      cardType: [new Schema({
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }, config.schemaOptions)],
      title: { type: String, required: true },
      description: { type: String },
      points: { type: Number },
      tags: { type: [String], 'default': [] },
      history: [new Schema({
        userId: { type: ObjectId, required: true },
        date: { type: Date, required: true },
        laneName: { type: String, required: true },
        action: { type: String, required: true }
      }, config.schemaOptions)],
      comments: [new Schema({
        text: { type: String, required: true },
        userId: { type: ObjectId, required: true },
        createdOn: { type: Date, required: true }
      }, config.schemaOptions)]
    }, config.schemaOptions)]
  }, config.schemaOptions);

  // register release with mongoose
  mongoose.model('Release', Release);
};
