var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/sessions';

describe('sessions rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create a session', function (done) {
    superagent.post(root).send({
      user: { name: 'Garth', password: 'test' }
    })
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.headers['set-cookie']).to.exist;
      expect(res.headers['set-cookie'].length).to.equal(1);
      expect(res.headers['set-cookie'][0]).to.contain('session=');
      done();
    });
  });

  it('gets the current session', function (done){
    superagent.get(root)
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.name).to.equal('Garth');
      done();
    });
  });

  it('can delete a session', function(done){
    superagent.del(root)
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });


  it('cannot delete a session when not authenticated', function(done){
    superagent.del(root)
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(401);
      done();
    });
  });

  it('cannot delete a session with an invalid id', function(done){
    superagent.del(root)
    .set('Cookie', 'session=62875455e3e2812b6e0000xx;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(401);
      done();
    });
  });

});
