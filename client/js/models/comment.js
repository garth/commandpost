require('./card');
require('./user');

App.Comment = DS.Model.extend({
  card: DS.belongsTo('card'),
  text: DS.attr('string'),
  user: DS.belongsTo('user'),
  createdOn: DS.attr('date')
});
