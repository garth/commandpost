var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/cardTypes';

describe('card types rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  // it('can create card types', function (done) {
  //   superagent.post(root).send({
  //     cardType: {
  //       board: '22875455e3e2812b6e000001',
  //       name: 'Special',
  //       icon: 'icon',
  //       pointScale: '1,2,3',
  //       priority: 0
  //     }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.cardType).to.exist;
  //     expect(res.body.cardType.id.length).to.equal(24);
  //     done();
  //   });
  // });

  // it('retrieves a card type', function (done) {
  //   superagent.get(root + '/72875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.cardType).to.exist;
  //     expect(res.body.cardType.name).to.equal('Story');
  //     done();
  //   });
  // });

  // it('retrieves a card type collection', function (done) {
  //   superagent.get(root + '?board=22875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.cardTypes).to.exist;
  //     expect(res.body.cardTypes.length).to.equal(3);
  //     done();
  //   });
  // });

  // it('gives 404 for missing cardtypes', function (done) {
  //   superagent.get(root + '/72875455e3e2812b6e000099')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(404);
  //     done();
  //   });
  // });

  // it('updates a card type', function (done) {
  //   superagent.put(root + '/72875455e3e2812b6e000001').send({
  //     cardType: { name: 'Renamed' }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

  // it('removes a card type', function (done) {
  //   superagent.del(root + '/72875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

});
