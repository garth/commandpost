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

  canDelete: function () {
    return this.get('model.isAdmin') || !this.get('model.id');
  }.property('model.isAdmin', 'model.id'),

  actions: {

    open: function () {
      this.get('model').set('isEditing', true);
    },

    close: function () {
      var card = this.get('model');

      // check if the user has permission to save changes
      if (!card.get('isUser')) {
        return card.set('isEditing', false);
      }

      var lane = card.get('lane');
      var action = card.get('id') ? 'update' : 'create';
      var properties = [
        'id', 'cardTypeId', 'title', 'description', 'points', 'tags', 'assignedToUserId'
      ];
      if (action === 'create') {
        properties.push('order');
      }
      App.pubsub.publishAwait('/cards/' + action, {
        board: { id: lane.get('board.id') },
        lane: { id: lane.get('id') },
        card: card.getProperties(properties)
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
      var card = this.get('model');

      // check if the user has permission to delete
      if (!card.get('isUser')) {
        return;
      }

      this.set('showNewComment', true);
    },

    addImage: function () {
      var card = this.get('model');
      this.send('openModal', 'attachment', App.Attachment.create({
        card: card
      }));
    },

    saveComment: function () {
      var card = this.get('model');

      // check if the user has permission to delete
      if (!card.get('isUser')) {
        return;
      }

      App.pubsub.publish('/server/cards/comments/create', {
        board: { id: card.get('lane.board.id') },
        lane: { id: card.get('lane.id') },
        card: { id: card.get('id') },
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

      // check if the user has permission to delete
      if (!card.get('isUser')) {
        return;
      }

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
