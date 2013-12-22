App.BoardsCardController = Ember.ObjectController.extend({

  users: function () {
    return this.get('model.lane.board.users');
  }.property('model.lane.board.users'),

  cardTypes: function () {
    var cardTypes = this.get('model.lane.board.cardTypes') || Ember.A();
    return cardTypes.filter(function (cardType) {
      return !cardType.get('isHidden');
    }).sortBy('name');
  }.property('model.lane.board.cardTypes'),

  pointScale: function () {
    var points = this.get('model.cardType.pointScale');
    if (points) {
      return points.split(',').map(function (point) {
        return { points: parseInt(point, 10), label: point + ' points' };
      });
    }
    else {
      var card = this.get('model');
      if (!card.get('isDeleted')) {
        card.set('points', 0);
      }
      return [];
    }
  }.property('model.cardType'),

  actions: {

    open: function () {
      this.get('model').set('isEditing', true);
    },

    close: function () {
      var card = this.get('model');
      card.set('isEditing', false);
      card.save();
    },

    'delete': function () {
      var card = this.get('model');
      var cards = card.get('lane.cards');
      cards.removeObject(card);
      card.deleteRecord();
      card.save();
    }
  }
});
