Ember.Handlebars.registerBoundHelper('time-since', function(date) {
  return moment(date).fromNow();
});

Ember.Handlebars.registerBoundHelper('time-duration', function(span) {
  return moment.duration(span).humanize();
});
