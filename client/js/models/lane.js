require('./project');

App.Lane = DS.Model.extend({
  project: DS.belongsTo('project'),
  name: DS.attr('string'),
  order: DS.attr('number')
});
