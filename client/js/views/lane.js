App.BoardsLaneView = Ember.View.extend({
  laneStyle: null,

  updateStyle: function () {
    var height = Ember.$(window).height() - 240;
    this.set('laneStyle', 'height: ' + (height < 200 ? 200 : height) + 'px;');
  },

  setup: function () {
    this.updateStyle();
    var self = this;
    window.addEventListener("resize", function () {
      self.updateStyle();
    });
  }.on('didInsertElement')
});
