require('./board-user');
require('./lane');
require('./card-type');

App.BoardSummary = Ember.Object.extend({
  id: null,
  name: null
});

App.Board = App.BoardSummary.extend({
  createdByUserId: null,
  createdOn: null,
  users: null,
  lanes: null,
  defaultCardTypeId: null,
  cardTypes: null,

  init: function() {
    this._super();
    var self = this;

    // type index's for finding objects by id
    this.laneIndex = {};
    this.cardIndex = {};
    this.userIndex = {};
    this.cardTypeIndex = {};

    // index and filter for searching
    this.set('index', window.lunr(function () {
      this.field('title', { boost: 3 });
      this.field('description', { boost: 2 });
      this.field('commentText', { boost: 1 });
      this.ref('id');
    }));
    this.set('filter', App.Filter.create({ board: this }));

    // prepare data
    var users = this.get('users');
    if (users) {
      var userId = App.get('user.id');
      var isAdmin = App.get('user.role') === 'admin';
      var isUser = isAdmin;
      this.set('users', _.map(users, function (user) {
        if (userId === user.userId) {
          isAdmin = isAdmin || user.role === 'admin';
          isUser = isUser || isAdmin || user.role === 'user';
        }
        user.board = self;
        user.user = App.userIndex[user.userId];
        var userObj = App.BoardUser.create(user);
        self.userIndex[user.userId] = userObj;
        return userObj;
      }));
      this.set('isAdmin', isAdmin);
      this.set('isUser', isUser);
    }
    var cardTypes = this.get('cardTypes');
    if (cardTypes) {
      this.set('cardTypes', _.map(cardTypes, function (cardType) {
        cardType.board = self;
        var cardTypeObj = App.CardType.create(cardType);
        self.cardTypeIndex[cardType.id] = cardTypeObj;
        return cardTypeObj;
      }));
    }
    var lanes = this.get('lanes');
    if (!lanes) {
      lanes = [];
    }
    lanes = _.map(lanes, function (lane) {
      lane.board = self;
      var laneObj = App.Lane.create(lane);
      self.laneIndex[lane.id] = laneObj;
      return laneObj;
    });
    this.set('lanes', Ember.ArrayController.create({
      content: lanes,
      sortProperties: ['order'],
      sortAscending: true
    }));
  },

  isAdmin: null,
  isUser: null,

  index: null,
  filter: null,
  matches: null,

  defaultCardType: function () {
    var defaultCardTypeId = this.get('defaultCardTypeId');
    this.cardTypeIndex[defaultCardTypeId];
  }.property('defaultCardTypeId', 'cardTypes'),

  createdByUser: function () {
    var createdByUserId = this.get('createdByUserId');
    return App.userIndex[createdByUserId];
  }.property('createdByUserId', 'App.users'),

  visibleCardTypes: function () {
    return this.get('cardTypes').filter(function (cardType) {
      return !cardType.get('isHidden');
    });
  }.property('cardTypes.@each.isHidden'),

  tagsIndex: function () {
    var index = {};
    this.get('lanes').forEach(function (lane) {
      index = _.merge(index, lane.get('tagsIndex'));
    });
    return index;
  }.property('lanes.@each.tagsIndex'),

  tags: function () {
    var tags = _.keys(this.get('tagsIndex'));
    tags.sort();
    return tags;
  }.property('tagsIndex'),

  showLaneStats: function (key, value) {
    var id = this.get('id');
    var storageKey = 'board_' + id + '_showLaneStats';
    if (key && value !== undefined) {
      if (!value) {
        delete window.localStorage[storageKey];
      }
      else {
        window.localStorage[storageKey] = JSON.stringify(!value);
      }
      return !!value;
    }
    else if (id) {
      value = window.localStorage[storageKey];
      return value ? value === 'false' : false;
    }
    return false;
  }.property()
});
