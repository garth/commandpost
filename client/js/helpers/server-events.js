// models can use App.server to listen to change events from the server
App.serverEvents = new window.EventSource('/api/events');

App.serverEvents.addEventListener('ping', function(e) {
  // keep alive message from server
}, false);

// App.serverEvents.addEventListener('open', function(e) {
//   console.log('/api/events connection open', e);
// }, false);

// App.serverEvents.addEventListener('error', function(e) {
//   if (e.readyState === window.EventSource.CLOSED) {
//     console.log('/api/events connection closed', e);
//   }
//   else {
//     console.log('/api/events error', e);
//   }
// }, false);
