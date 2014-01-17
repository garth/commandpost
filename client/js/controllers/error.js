App.ErrorController = Ember.Controller.extend({
  title: function () {
    var err = this.get('content');
    setTimeout(function () {
      throw err;
    }, 1);
    return err.statusText || 'Error';
  }.property('content'),
  message: function () {
    var err = this.get('content');
    return err.status;
  }.property('content'),
  details: function () {
    var err = this.get('content');
    return '';
  }.property('content')
});
