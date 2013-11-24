var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/comments';

describe('comments rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create comments', function (done) {
    superagent.post(root).send({
      comment: { text: 'Interesting point', card: '42875455e3e2812b6e000001' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.comment).to.exist;
      expect(res.body.comment.id.length).to.equal(24);
      done();
    });
  });

  it('retrieves a comment', function (done) {
    superagent.get(root + '/52875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.comment).to.exist;
      expect(res.body.comment.text).to.equal('I like it');
      done();
    });
  });

  it('retrieves a comment collection', function (done) {
    superagent.get(root + '?card=42875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.comments).to.exist;
      expect(res.body.comments.length).to.equal(2);
      done();
    });
  });

  it('updates a comment', function (done) {
    superagent.put(root + '/52875455e3e2812b6e000001').send({
      comment: { title: 'fixed my remarks' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

  it('removes a comment', function (done) {
    superagent.del(root + '/52875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

});
