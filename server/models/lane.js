var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define lane
  var Lane = new Schema({
    project: { type: ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    order: { type: Number }
  }, config.schemaOptions);

  // register lane with mongoose
  mongoose.model('Lane', Lane);
};
