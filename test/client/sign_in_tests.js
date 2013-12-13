/*global visit:true, find:true, fillIn:true, click:true, keyEvent:true, wait:true, exists:true*/

var expect = chai.expect;

describe('sign in', function () {

  beforeEach(function (done) {
    App.resetFixtures(done);
  });

  afterEach(function() {
    App.reset();
  });

  it('can sign in', function (done) {
    visit('/signin')
    .fillIn('input[type=text]', 'Garth')
    .fillIn('input[type=password]', 'test')
    .click('button[type=submit]')
    .then(function () {
      expect(App.get('isSignedIn')).to.be.true;
      done();
    });
  });

});
