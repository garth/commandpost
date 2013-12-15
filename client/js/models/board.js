require('./user');

App.Board = DS.Model.extend({
  name: DS.attr('string'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date')
});
