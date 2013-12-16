require('./lane');
require('./user');
require('./comment');

App.Card = DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  points: DS.attr('number'),
  createdByUser: DS.belongsTo('user'),
  createdOn: DS.attr('date'),
  assignedToUser: DS.belongsTo('user'),
  lane: DS.belongsTo('lane'),
  order: DS.attr('number'),
  comments: DS.hasMany('comment', { async: true })
});
