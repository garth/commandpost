// require('./card');
// require('./user');

App.Comment = Ember.Object.extend({
  card: null,

  id: null,
  text: null,
  userId: null,
  createdOn: null
});

// App.serverEvents.addEventListener('createComment', function(e) {
//   var store = App.Comment.store;
//   var commentData = JSON.parse(e.data).document;
//   var comment = store.getById('comment', commentData.id);
//   if (!comment) {
//     var card = store.getById('card', commentData.card);
//     // add the comment if the card is in the store
//     if (card) {
//       comment = store.push('comment', commentData);
//       card.get('comments.content').pushObject(comment);
//     }
//   }
// }, false);

// App.serverEvents.addEventListener('updateComment', function(e) {
//   var store = App.Comment.store;
//   var commentData = JSON.parse(e.data).document;
//   var comment = store.getById('card', commentData.id);
//   // update the comment if it's in the store
//   if (comment) {
//     store.push('comment', commentData);
//   }
// }, false);

// App.serverEvents.addEventListener('deleteComment', function(e) {
//   var store = App.Comment.store;
//   var commentData = JSON.parse(e.data).document;
//   var comment = store.getById('card', commentData.id);
//   // remove the comment from the store
//   if (comment && !comment.get('isDeleted')) {
//     comment.get('card.comments.content').removeObject(comment);
//     store.unloadRecord(comment);
//   }
// }, false);
