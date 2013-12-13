require('../models/project');

App.ProjectsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('project');
  }
});

App.ProjectsNewRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('projects.edit', this.store.createRecord('project', { name: 'New' }).save());
  }
});

App.ProjectsEditController = Ember.ObjectController.extend({
  actions: {
    save: function () {
      var project = this.get('content');
      project.save();
      this.transitionToRoute('projects.view', project);
    },
    'delete': function () {
      var project = this.get('content');
      project.deleteRecord();
      project.save();
      this.transitionToRoute('projects');
    }
  }
});

App.ProjectsViewController = Ember.ObjectController.extend({

});
