var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function (config, db) {

  // define project
  var Project = new Schema({
    name: { type: String, index: { unique: true, dropDups: true }, required: true },
    createdByUser: { type: ObjectId, ref: 'User', required: true },
    createdOn: { type: Date }
  }, config.schemaOptions);

  // register project with mongoose
  mongoose.model('Project', Project);
};
