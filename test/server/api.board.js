var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/boards';

describe('board rest api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create boards', function (done) {
    superagent.post(root).send({
      board: { name: 'Board X' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.board).to.exist;
      expect(res.body.board.id.length).to.equal(24);
      expect(res.body.board.createdByUser).to.equal('12875455e3e2812b6e000001');
      expect(res.body.board.lanes).to.exist;
      expect(res.body.board.lanes.length).to.equal(4);
      expect(res.body.board.cardTypes).to.exist;
      expect(res.body.board.cardTypes.length).to.equal(3);
      done();
    });
  });

  it('cannot create duplicate boards', function (done) {
    superagent.post(root).send({
      board: { name: 'Board' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(409);
      done();
    });
  });

  it('retrieves a board', function (done) {
    superagent.get(root + '/22875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.board).to.exist;
      expect(res.body.board.name).to.equal('Board');
      expect(res.body.board.createdByUser).to.equal('12875455e3e2812b6e000001');
      expect(res.body.board.createdOn).to.equal('2013-11-20T00:00:00.000Z');
      expect(res.body.board.lanes).to.exist;
      expect(res.body.board.lanes.length).to.equal(3);
      expect(res.body.board.cardTypes).to.exist;
      expect(res.body.board.cardTypes.length).to.equal(3);
      done();
    });
  });

  it('retrieves a board collection', function (done) {
    superagent.get(root)
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.boards).to.exist;
      expect(res.body.boards.length).to.equal(2);
      done();
    });
  });

  it('gives 404 for missing board', function (done) {
    superagent.get(root + '/22875455e3e2812b6e000099')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(404);
      done();
    });
  });

  it('updates a board', function (done) {
    superagent.put(root + '/22875455e3e2812b6e000001').send({
      board: { name: 'Next Proj' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

  it('removes a board', function (done) {
    superagent.del(root + '/22875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      //check the lanes are gone also
      superagent.get('http://localhost:3001/api/lanes/32875455e3e2812b6e000001')
      .set('Cookie', 'session=62875455e3e2812b6e000001;')
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

});
