require('./card');

App.Lane = Ember.Object.extend({
  board: null,

  id: null,
  name: null,
  type: null,
  order: null,
  cards: null,

  init: function() {
    this._super();
    var self = this;
    var cards = this.get('cards');
    if (cards) {
      this.set('cards', _.map(cards, function (card) {
        card.lane = self;
        return App.Card.create(card);
      }));
    }
  },

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

  isVisible: function (key, value) {
    var id = this.get('id');
    var defaultValue = this.get('type') !== 'hidden';
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
