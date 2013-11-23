var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/users';

describe('users rest api', function () {

  beforeEach(function (done) {
    require('./fixtures')(done);
  });

  it('can create users', function (done) {
    superagent.post(root).send({
      user: { name: 'Greg', password: 'password' }
    }).end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.id.length).to.equal(24);
      expect(res.body.user.password).to.be.undefined;
      done();
    });
  });

  it('cannot create duplicate users', function (done) {
    superagent.post(root).send({
      user: { name: 'Garth', password: 'password' }
    }).end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(409);
      done();
    });
  });

  it('retrieves a user', function (done){
    superagent.get(root + '/12875455e3e2812b6e000001')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.name).to.equal('Garth');
      done();
    });
  });

  it('retrieves a user collection', function(done){
    superagent.get(root)
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      console.log(res.body);
      expect(res.body).to.exist;
      expect(res.body.users).to.exist;
      expect(res.body.users.length).to.equal(2);
      expect(res.body.users[0].password).to.be.undefined;
      done();
    });
  });

  it('updates a user', function(done){
    superagent.put(root + '/12875455e3e2812b6e000002').send({
      user: { name: 'George', password: 'password' }
    })
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

  it('removes a user', function(done){
    superagent.del(root + '/12875455e3e2812b6e000002')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

});
