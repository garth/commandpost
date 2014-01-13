//var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/cards';

describe('cards rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  // it('can create cards', function (done) {
  //   superagent.post(root).send({
  //     card: {
  //       cardType: '72875455e3e2812b6e000001',
  //       title: 'Amazing Thing',
  //       lane: '32875455e3e2812b6e000001'
  //     }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.card).to.exist;
  //     expect(res.body.card.id.length).to.equal(24);
  //     done();
  //   });
  // });

  // it('retrieves a card', function (done) {
  //   superagent.get(root + '/42875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.card).to.exist;
  //     expect(res.body.card.title).to.equal('Item 1');
  //     expect(res.body.card.comments).to.exist;
  //     expect(res.body.card.comments.length).to.equal(2);
  //     done();
  //   });
  // });

  // it('retrieves a card collection', function (done) {
  //   superagent.get(root + '?lane=32875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     expect(res.body.cards).to.exist;
  //     expect(res.body.cards.length).to.equal(4);
  //     done();
  //   });
  // });

  // it('gives 404 for missing card', function (done) {
  //   superagent.get(root + '/42875455e3e2812b6e000099')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.eql(null);
  //     expect(res.status).to.equal(404);
  //     done();
  //   });
  // });

  // it('updates a card', function (done) {
  //   superagent.put(root + '/42875455e3e2812b6e000001').send({
  //     card: { name: 'new title' }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

  // it('removes a card', function (done) {
  //   superagent.del(root + '/42875455e3e2812b6e000001')
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     //check the comments are gone also
  //     superagent.get('http://localhost:3001/api/comments/52875455e3e2812b6e000001')
  //     .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //     .end(function (err, res) {
  //       expect(err).to.eql(null);
  //       expect(res.status).to.equal(404);
  //       done();
  //     });
  //   });
  // });

});
