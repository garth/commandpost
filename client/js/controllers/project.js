require('../models/project');

App.ProjectsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('project');
  }
});

App.ProjectsNewRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('projects.edit', this.store.createRecord('project', {
      name: 'New' // + moment().format('YYYYMMDDHHmmss')
    }).save());
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
      project.save();
      this.transitionToRoute('projects.view', project);
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
