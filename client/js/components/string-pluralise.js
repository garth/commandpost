var inflection = require( 'inflection' );

App.StringPluraliseComponent = Ember.Component.extend({
  tagName: 'span',

  number: null,
  singular: null,
  plural: null,

  result: function () {
    var params = this.getProperties('number', 'singular', 'plural');
    return params.number === 1 ?
      params.singular :
      params.plural || inflection.pluralize(params.singular);
  }.property('number', 'singular', 'plural')
});
