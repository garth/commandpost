var expect = require('chai').expect;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var config = require('../server/config/config')('test');
var db = require('../server/config/mongoose')(config);
var User = mongoose.model('User');

describe('user', function () {

  beforeEach(function (done) {
    require('./fixtures')(done);
  });

  it('can set password', function (done) {
    (new User({
      name: 'Garth',
      password: 'test'
    })).save(function (err, user) {
      if (err) { return done(err); }
      console.log(user.password);
      expect(user.password).to.not.equal('test');
      expect(user.password.length).to.equal(56);
      done();
    });
  });

  it('can verify password', function (done) {
    User.findOne({ name: 'Garth' }, function (err, user) {
      if (err) { return done(err); }
      expect(user.password).to.equal('sha1$87eb07a6$1$40c17198317550debf1a7cf19bf793d8d97b51e3');
      expect(user.checkPassword('test')).to.be.true;
      expect(user.checkPassword('test1')).to.be.false;
    });
    done();
  });

});
