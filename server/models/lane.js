var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define lane
  var Lane = new Schema({
    project: { type: ObjectId, ref: 'Project', index: true, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, 'default': 0 }
  }, config.schemaOptions);

  // register lane with mongoose
  mongoose.model('Lane', Lane);
};
