require('./board');
require('./card');

App.Lane = DS.Model.extend({
  board: DS.belongsTo('board'),
  name: DS.attr('string'),
  order: DS.attr('number'),
  cards: DS.hasMany('card', { async: true })
});

App.serverEvents.addEventListener('createLane', function(e) {
  var store = App.Lane.store;
  var laneData = JSON.parse(e.data).document;
  var lane = store.getById('lane', laneData.id);
  if (!lane) {
    var board = store.getById('board', laneData.board);
    // add the lane if the board is in the store
    if (board) {
      lane = store.push('lane', laneData);
      board.get('lanes.content').pushObject(lane);
    }
  }
}, false);

App.serverEvents.addEventListener('updateLane', function(e) {
  var store = App.Lane.store;
  var laneData = JSON.parse(e.data).document;
  var lane = store.getById('lane', laneData.id);
  // update the lane if it's in the store
  if (lane) {
    store.push('lane', laneData);
  }
}, false);

App.serverEvents.addEventListener('deleteLane', function(e) {
  var store = App.Lane.store;
  var laneData = JSON.parse(e.data).document;
  var lane = store.getById('lane', laneData.id);
  // remove the lane from the store
  if (lane) {
    lane.get('board.lanes.content').removeObject(lane);
    store.unloadRecord(lane);
  }
}, false);
