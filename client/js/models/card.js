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

  init: function () {
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
    var index = this.get('lane.board.index');
    if (index) {
      index.add(this.getProperties('id', 'title', 'description', 'commentText'));
    }
  },

  willDestroy: function () {
    var index = this.get('lane.board.index');
    if (index) {
      index.remove(this.getProperties('id'));
    }
    this._super();
  },

  isAdmin: function () {
    return this.get('lane.isAdmin');
  }.property('lane.isAdmin'),

  isUser: function () {
    return this.get('lane.isUser');
  }.property('lane.isUser'),

  cardType: function () {
    return this.get('lane.board').cardTypeIndex[this.get('cardTypeId')];
  }.property('cardTypeId', 'lane.board.cardTypes'),

  createdByUser: function () {
    return App.userIndex[this.get('createdByUserId')];
  }.property('createdByUserId', 'App.users'),

  assignedToUser: function () {
    return App.userIndex[this.get('assignedToUserId')];
  }.property('assignedToUserId', 'App.users'),

  priority: function () {
    return (this.get('cardType.priority') || 0) * -1;
  }.property(),

  returnedToLane: function () {
    var lane = this.get('lane.name');
    var count = 0;
    if (lane) {
      _.forEach(this.get('history'), function (history) {
        if (history.get('laneName') === lane) { count++; }
      });
    }
    return count > 1;
  }.property('lane.name', 'history.@each.laneName'),

  matchesFilter: function () {
    var matches = this.get('lane.board.matches');
    return matches ? matches[this.get('id')] : true;
  }.property('lane.board.matches'),

  commentText: function () {
    var comments = [];
    this.get('comments').forEach(function (comment) {
      comments.push(comment.get('text'));
    });
    return comments.join(' ');
  }.property('comments.@each.text'),

  updateIndex: function () {
    var index = this.get('lane.board.index');
    if (index) {
      index.update(this.getProperties('id', 'title', 'description', 'commentText'));
    }
  }.observes('title', 'description', 'commentText')
});
