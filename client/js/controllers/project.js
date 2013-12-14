require('../models/project');

var Promise = Ember.RSVP.Promise;

App.ProjectsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('project');
  }
});

App.ProjectsNewRoute = Ember.Route.extend({
  redirect: function () {
    var store = this.store;
    var project = store.createRecord('project', {
      name: 'New' // + moment().format('YYYYMMDDHHmmss')
    });
    this.transitionTo('projects.edit', new Promise(function (resolve, reject) {
      project.save().then(resolve, function (err) {
        project.deleteRecord();
        reject(App.flash.serverError('Failed to create board', err));
      });
    }));
  }
});

App.ProjectsEditRoute = Ember.Route.extend({
  setupController: function (controller, project) {
    controller.setProperties({
      confirmDelete: null,
      content: project
    });
  }
});

App.ProjectsEditController = Ember.ObjectController.extend({

  confirmDelete: null,

  actions: {
    save: function () {
      var project = this.get('content');
      var self = this;
      project.save().then(function (project) {
        self.transitionToRoute('projects.view', project);
      }, function (err) {
        App.flash.serverError('Failed to save board', err);
      });
    },
    'delete': function () {
      var project = this.get('content');
      if (this.get('confirmDelete') === project.get('name')) {
        project.deleteRecord();
        project.save();
        this.transitionToRoute('projects');
      }
    }
  }
});

App.ProjectsViewController = Ember.ObjectController.extend({

});
