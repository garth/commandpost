require('./comment');
require('./history');

App.Card = Ember.Object.extend({
  lane: null,

  id: null,
  cardTypeId: null,
  title: null,
  description: null,
  points: null,
  tags: null,
  createdByUserId: null,
  createdOn: null,
  assignedToUserId: null,
  order: null,
  comments: null,
  history: null,

  isEditing: false,
  showHistory: false,

  init: function() {
    this._super();
    var self = this;
    var comments = this.get('comments');
    if (comments) {
      this.set('comments', _.map(comments, function (comment) {
        comment.card = self;
        return App.Comment.create(comment);
      }));
    }
    var history = this.get('history');
    if (history) {
      this.set('history', _.map(history, function (history) {
        history.card = self;
        return App.History.create(history);
      }));
    }
  },

  cardType: function () {
    var board = this.get('lane.board');
    var cardTypeId = this.get('cardTypeId');
    return board.cardTypeIndex[cardTypeId];
  }.property('cardTypeId', 'lane.board.cardTypes'),

  createdByUser: function () {
    var createdByUserId = this.get('createdByUserId');
    return App.userIndex[createdByUserId];
  }.property('createdByUserId', 'App.users'),

  assignedToUser: function () {
    var assignedToUserId = this.get('assignedToUserId');
    return App.userIndex[assignedToUserId];
  }.property('assignedToUserId', 'App.users'),

  priority: function () {
    return (this.get('cardType.priority') || 0) * -1;
  }.property()
});
