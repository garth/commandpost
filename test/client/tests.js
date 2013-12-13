Ember.Test.adapter = Ember.Test.MochaAdapter.create();

App.resetFixtures = function (done) {
  App.ajaxPost({ url: '/test/reset-fixtures' }).then(function (data) {
    done();
  }, function (response) {
    console.log(response);
    throw 'Fixture reset failed';
  });
};
