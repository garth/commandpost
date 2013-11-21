require('./card');
require('./user');

App.Lane = DS.Model.extend({
  card: DS.belongsTo('card'),
  text: DS.attr('string'),
  user: DS.belongsTo('user'),
  createdOn: DS.attr('date')
});
