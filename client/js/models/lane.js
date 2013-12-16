require('./board');
require('./card');

App.Lane = DS.Model.extend({
  board: DS.belongsTo('board'),
  name: DS.attr('string'),
  order: DS.attr('number'),
  cards: DS.hasMany('card', { async: true })
});
