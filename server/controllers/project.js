var mongoose = require('mongoose');
var Project = mongoose.model('Project');

module.exports = function (app, config, db) {

  app.get('/api/projects', function (req, res, next) {
    Project.find(req.params || {}, function (err, projects) {
      if (err) { return next(err); }
      res.send({ projects: projects });
    });
  });

  app.post('/api/projects', function (req, res, next) {
    (new Project(req.body.project)).save(function (err, project) {
      if (err) { return next(err); }
      res.send({ project: project.toJSON() });
    });
  });

  app.get('/api/projects/:id', function (req, res, next) {
    Project.findById(req.params.id, function (err, project) {
      if (err) { return next(err); }
      res.send({ project: project });
    });
  });

  app.put('/api/projects/:id', function (req, res, next) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, project) {
      if (err) { return next(err); }
      res.end();
    });
  });

  app.del('/api/projects/:id', function (req, res, next) {
    Project.findByIdAndRemove(req.params.id, function(err, project) {
      if (err) { return next(err); }
      res.end();
    });
  });
};
