var mongoose = require('mongoose');
var Project = mongoose.model('Project');

module.exports = function (app, config, db) {

  var authorise = require('../authorise')(config);

  app.get('/api/projects', authorise, function (req, res, next) {
    Project.find(req.query || {}, function (err, projects) {
      if (err) { return next(err); }
      res.send({ projects: projects });
    });
  });

  app.post('/api/projects', authorise, function (req, res, next) {
    var project = req.body.project;
    project.createdByUser = req.user.id;
    project.createdOn = Date.now();
    (new Project(project)).save(function (err, project) {
      if (err) { return next(err); }
      res.send({ project: project.toJSON() });
    });
  });

  app.get('/api/projects/:id', authorise, function (req, res, next) {
    Project.findById(req.params.id, function (err, project) {
      if (err) { return next(err); }
      res.send({ project: project });
    });
  });

  app.put('/api/projects/:id', authorise, function (req, res, next) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, project) {
      if (err) { return next(err); }
      res.send({});
    });
  });

  app.del('/api/projects/:id', authorise, function (req, res, next) {
    Project.findByIdAndRemove(req.params.id, function(err, project) {
      if (err) { return next(err); }
      res.send({});
    });
  });
};
