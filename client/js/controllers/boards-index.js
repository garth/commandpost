App.BoardsIndexController = Ember.ArrayController.extend({
  needs: ['boards'],
  modelBinding: 'controllers.boards.model'
});
