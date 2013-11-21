require('./user');

App.Project = DS.Model.extend({
  name: DS.attr('string'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date')
});
