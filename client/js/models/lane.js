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
    if (!cards) {
      cards = [];
    }
    cards = _.map(cards, function (card) {
      card.lane = self;
      var cardObj = App.Card.create(card);
      board.cardIndex[card.id] = cardObj;
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
    var defaultValue = this.get('defaultIsVisible');
    if (key && value !== undefined) {
      if (value === defaultValue) {
        delete window.localStorage['lane_' + id + '_isHidden'];
      }
      else {
        window.localStorage['lane_' + id + '_isHidden'] = JSON.stringify(!value);
      }
      return !!value;
    }
    else if (id) {
      value = window.localStorage['lane_' + id + '_isHidden'];
      return value ? value === 'false' : defaultValue;
    }
    return defaultValue;
  }.property()
});
