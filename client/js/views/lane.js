App.BoardsLaneView = Ember.View.extend({
  laneStyle: null,

  updateStyle: function () {
    var height = Ember.$(window).height() - 240;
    this.set('laneStyle', 'height: ' + (height < 200 ? 200 : height) + 'px;');
  },

  setup: function () {
    this.updateStyle();
    var self = this;
    this.resizeHandler = function () {
      self.updateStyle();
    };
    window.addEventListener('resize', this.resizeHandler);
  }.on('didInsertElement'),

  teardown: function () {
    window.removeEventListener('resize', this.resizeHandler);
  }.on('willDestroyElement')
});
