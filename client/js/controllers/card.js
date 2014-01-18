require('../views/card');

App.BoardCardController = Ember.ObjectController.extend({

  newComment: '',
  showNewComment: false,

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
      var lane = card.get('lane');
      var action = card.get('id') ? 'update' : 'create';
      App.pubsub.publishAwait('/cards/' + action, {
        board: { id: lane.get('board.id') },
        lane: { id: lane.get('id') },
        card: card.getProperties(
          'id', 'cardTypeId', 'title', 'description', 'points', 'tags', 'assignedToUserId')
      }).then(function (message) {
        if (action === 'create') {
          lane.get('cards').removeObject(card);
        }
        else {
          card.set('isEditing', false);
        }
      });
    },

    addComment: function () {
      this.set('showNewComment', true);
    },

    saveComment: function () {
      App.pubsub.publish('/server/cards/comments/create', {
        board: { id: this.get('model.lane.board.id') },
        lane: { id: this.get('model.lane.id') },
        card: { id: this.get('model.id') },
        comment: { text: this.get('newComment') }
      });
      this.setProperties({ newComment: null, showNewComment: false });
    },

    toggleHistory: function () {
      var card = this.get('model');
      card.set('showHistory', !card.get('showHistory'));
    },

    'delete': function () {
      var card = this.get('model');
      var lane = card.get('lane');
      if (card.get('id')) {
        App.pubsub.publish('/server/cards/delete', {
          board: { id: lane.get('board.id') },
          lane: { id: lane.get('id') },
          card: { id: card.get('id') }
        });
      }
      else {
        lane.get('cards').removeObject(card);
      }
    }
  }
});
