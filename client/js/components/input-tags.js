App.InputTagsComponent = Ember.Component.extend({
  value: null,
  allTags: null,
  placeholder: 'tag',

  setup: function () {
    // setup tag control
    var input = this.$('input.tags');
    input.tagsinput({
      tagClass: function (item) {
        return 'label label-primary';
      }
    });

    // setup type ahead control
    var tagsInput = input.tagsinput('input');
    var allTags = this.get('allTags');
    if (allTags) {
      tagsInput.typeahead({
        local: allTags,
        limit: 10
      });

      var autocomplete = function (object, datum) {
        input.tagsinput('add', datum.value);
        tagsInput.typeahead('setQuery', '');
      };
      tagsInput.on('typeahead:selected', autocomplete);
      tagsInput.on('typeahead:autocompleted', autocomplete);
    }

    // set the initial tags
    var value = this.get('value');
    if (value) {
      value.forEach(function (tag) {
        input.tagsinput('add', tag);
      });
    }

    // watch for changes
    var self = this;
    input.change(function () {
      // sort and store the tags
      var tags = input.tagsinput('items');
      tags.sort();
      self.set('value', tags);
      // ensure that the typeahead is cleared
      if (allTags) {
        tagsInput.typeahead('setQuery', '');
      }
    });
  }.on('didInsertElement'),

  teardown: function () {
    this.$('input.tt-query').typeahead('destroy');
    this.$('input.tags').tagsinput('destroy');
  }.on('willDestroyElement')
});
