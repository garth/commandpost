var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

module.exports = function (config, db) {

  // define history
  var History = new Schema({
    userId: { type: ObjectId, required: true },
    date: { type: Date, required: true, 'default': Date.now },
    action: { type: String, enum: ['create', 'update', 'delete'], require: true },
    documentType: { type: String, require: true },
    document: { type: Mixed, require: true },
    previousValues: { type: Mixed }
  }, config.schemaOptions);

  // register history with mongoose
  mongoose.model('History', History);
};
