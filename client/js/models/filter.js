App.Filter = Ember.Object.extend({
  board: null,

  userId: null,
  cardTypeId: null,
  tags: null,
  text: null,

  search: function () {
    var filter = this.getProperties('userId', 'cardTypeId', 'tags', 'text');
    var board = this.get('board');

    // check that there is something to filter
    if (!filter.userId && !filter.cardTypeId && !filter.tags && !filter.text) {
      board.set('matches', null);
      return;
    }

    var cards = _.values(board.cardIndex);
    // filter by user
    if (filter.userId) {
      cards = _.filter(cards, function (card) {
        return card.get('assignedToUserId') === filter.userId;
      });
    }
    // filter by card type
    if (filter.cardTypeId) {
      cards = _.filter(cards, function (card) {
        return card.get('cardTypeId') === filter.cardTypeId;
      });
    }
    // filter by text
    if (filter.text) {
      var index = board.get('index');
      var results = {};
      _.forEach(index.search(filter.text), function (result) {
        results[result.ref] = true;
      });
      cards = _.filter(cards, function (card) {
        return results[card.get('id')];
      });
    }
    // filter by tags
    if (filter.tags) {
      cards = _.filter(cards, function (card) {
        return _.intersection(card.get('tags'), filter.tags).length === filter.tags.length;
      });
    }
    // set matches
    var matches = {};
    _.forEach(cards, function (card) {
      matches[card.get('id')] = true;
    });
    board.set('matches', matches);
  }.observes('userId', 'cardTypeId', 'tags', 'text'),

  clear: function () {
    this.setProperties({
      userId: null,
      cardTypeId: null,
      tags: null,
      text: null
    });
  }
});
