App.pubsub = new window.Faye.Client('/pubsub', {
  timeout: 50,
  retry: 5
});

App.pubsub.on('transport:down', function() {
  App.flash.error('Service Unavailable');
});

App.pubsub.on('transport:up', function() {
  App.flash.success('Service Available');
});

App.pubsub.subscribe('/board/52b7656f012992730e000099/**', function (message) {
  console.log(message);
});
