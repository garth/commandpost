require('./user');
require('./lane');

App.Board = DS.Model.extend({
  name: DS.attr('string'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date'),
  lanes: DS.hasMany('lane',{ async: true })
});
