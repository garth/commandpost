var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/sessions';

describe('sessions rest api', function () {

  beforeEach(function (done) {
    require('./fixtures')(done);
  });

  it('can create a session', function (done) {
    superagent.post(root).send({
      user: { name: 'Garth', password: 'test' }
    }).end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.headers['set-cookie']).to.exist;
      expect(res.headers['set-cookie'].length).to.equal(1);
      expect(res.headers['set-cookie'][0]).to.contain('session=');
      done();
    });
  });

  it('can delete a session', function(done){
    superagent.del(root).set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

});
