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

});
