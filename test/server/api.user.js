//var superagent = require('superagent');
var expect = require('chai').expect;
var pubsub = require('../pubsub')('62875455e3e2812b6e000001');

describe('users api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create users', function (done) {
    pubsub.publishAwait('/users/create', {
      user: { name: 'Greg', initials: 'gr', login: 'Greg', password: 'password' }
    }).then(function (message) {
      try {
        expect(message.user).to.exist;
        expect(message.user.id.length).to.equal(24);
        expect(message.user.name).to.equal('Greg');
        expect(message.user.login).to.be.undefined;
        expect(message.user.password).to.be.undefined;
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  // it('cannot create duplicate users', function (done) {
  //   superagent.post(root).send({
  //     user: { name: 'Garth', password: 'password' }
  //   })
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(409);
  //     done();
  //   });
  // });

  // it('retrieves a user', function (done){
  //   superagent.get(root + '/12875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.user).to.exist;
  //     expect(res.body.user.name).to.equal('Garth');
  //     done();
  //   });
  // });

  it('retrieves a user collection', function (done) {
    pubsub.publishAwait('/users').then(function (message) {
      try {
        expect(message.users).to.exist;
        expect(message.users.length).to.equal(2);
        expect(message.users[0].name).to.equal('Garth');
        expect(message.users[1].name).to.equal('Brian');
        expect(message.users[0].password).to.be.undefined;
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  // it('gives 404 for missing user', function (done) {
  //   superagent.get(root + '/12875455e3e2812b6e000099')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(404);
  //     done();
  //   });
  // });

  // it('updates a user', function(done){
  //   superagent.put(root + '/12875455e3e2812b6e000002').send({
  //     user: { name: 'George', password: 'password' }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

  // it('removes a user', function(done){
  //   superagent.del(root + '/12875455e3e2812b6e000002')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

});
