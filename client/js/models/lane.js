require('./card');

App.Lane = Ember.Object.extend({
  board: null,

  id: null,
  name: null,
  type: null,
  order: null,
  cards: null,

  types: ['hidden', 'queue', 'in-progress', 'done'],

  init: function() {
    this._super();
    var self = this;
    var board = this.get('board');
    var cards = this.get('cards');
    var index = board.get('index');
    if (!cards) {
      cards = [];
    }
    cards = _.map(cards, function (card) {
      card.lane = self;
      var cardObj = App.Card.create(card);
      board.cardIndex[card.id] = cardObj;
      card.commentText = cardObj.get('commentText');
      index.add(card);
      return cardObj;
    });
    this.set('cards',  Ember.ArrayController.create({
      content: cards,
      sortProperties: ['order'],
      sortAscending: true
    }));
  },

  isAdmin: function () {
    return this.get('board.isAdmin');
  }.property('board.isAdmin'),

  isUser: function () {
    return this.get('board.isUser');
  }.property('board.isUser'),

  tags: function () {
    var allTags = [];
    this.get('cards').forEach(function (card) {
      var tags = card.get('tags');
      if (tags) {
        allTags = _.union(allTags, tags);
      }
    });
    allTags.sort();
    return allTags;
  }.property('cards.@each.tags'),

  points: function () {
    var points = 0;
    this.get('cards').forEach(function (card) {
      points += card.get('points');
    });
    return points;
  }.property('cards.@each.points'),

  cardTypes: function () {
    var typeIndex = {};
    var types = this.get('board.cardTypes').sortBy('name').map(function (cardType) {
      var type = { name: cardType.get('name'), count: 0 };
      typeIndex[cardType.get('id')] = type;
      return type;
    });
    this.get('cards').forEach(function (card) {
      typeIndex[card.get('cardTypeId')].count++;
    });
    return types;
  }.property('cards.@each.cardTypeId'),

  longestTenancy: function () {
    var now = Date.now();
    var date = now;
    this.get('cards').forEach(function (card) {
      var tenancy = card.get('history.lastObject.date');
      if (tenancy) {
        tenancy = Date.parse(tenancy);
        if (tenancy < date) {
          date = tenancy;
        }
      }
    });
    return date - now;
  }.property('cards.@each.history'),

  icon: function () {
    switch (this.get('type')) {
    case 'hidden':
      return 'fa-archive';
    case 'done':
      return 'fa-check';
    case 'in-progress':
      return 'fa-cog';
    default:
      return 'fa-inbox';
    }
  }.property('type'),

  defaultIsVisible: function () {
    return this.get('type') !== 'hidden';
  }.property('type'),

  isVisible: function (key, value) {
    var id = this.get('id');
    var storageKey = 'lane_' + id + '_isHidden';
    var defaultValue = this.get('defaultIsVisible');
    if (key && value !== undefined) {
      if (value === defaultValue) {
        delete window.localStorage[storageKey];
      }
      else {
        window.localStorage[storageKey] = JSON.stringify(!value);
      }
      return !!value;
    }
    else if (id) {
      value = window.localStorage[storageKey];
      return value ? value === 'false' : defaultValue;
    }
    return defaultValue;
  }.property()
});
