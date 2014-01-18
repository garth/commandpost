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

  cardType: function (key, value) {
    if (value) {
      this.set('cardTypeId', value.get('id'));
    }
    else {
      var cardTypes = this.get('lane.board.cardTypes');
      var cardTypeId = this.get('cardTypeId');
      if (cardTypes && cardTypeId) {
        return cardTypes.findBy('id', cardTypeId);
      }
    }
  }.property('cardTypeId', 'lane.board.cardTypes'),

  createdByUser: function () {
    var users = App.get('users');
    var createdByUserId = this.get('createdByUserId');
    if (users && createdByUserId) {
      return users.findBy('id', createdByUserId);
    }
  }.property('createdByUserId', 'App.users'),

  assignedToUser: function (key, value) {
    if (value) {
      this.set('assignedToUserId', value.get('id'));
    }
    else {
      var users = App.get('users');
      var assignedToUserId = this.get('assignedToUserId');
      if (users && assignedToUserId) {
        return users.findBy('id', assignedToUserId);
      }
    }
  }.property('assignedToUserId', 'App.users'),

  priority: function () {
    return (this.get('cardType.priority') || 0) * -1;
  }.property()
});
