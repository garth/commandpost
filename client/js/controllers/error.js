App.ErrorController = Ember.Controller.extend({
  title: function () {
    var err = this.get('content');
    console.log(err);
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
