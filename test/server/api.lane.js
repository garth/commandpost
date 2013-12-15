var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/lanes';

describe('lanes rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create lanes', function (done) {
    superagent.post(root).send({
      lane: { name: 'New Lane', board: '22875455e3e2812b6e000001' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.lane).to.exist;
      expect(res.body.lane.id.length).to.equal(24);
      done();
    });
  });

  it('retrieves a lane', function (done) {
    superagent.get(root + '/32875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.lane).to.exist;
      expect(res.body.lane.name).to.equal('One');
      done();
    });
  });

  it('retrieves a lane collection', function (done) {
    superagent.get(root + '?board=22875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.lanes).to.exist;
      expect(res.body.lanes.length).to.equal(3);
      done();
    });
  });

  it('gives 404 for missing lane', function (done) {
    superagent.get(root + '/32875455e3e2812b6e000099')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(404);
      done();
    });
  });

  it('updates a lane', function (done) {
    superagent.put(root + '/32875455e3e2812b6e000001').send({
      lane: { name: 'Renamed' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

  it('removes a lane', function (done) {
    superagent.del(root + '/32875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

});
