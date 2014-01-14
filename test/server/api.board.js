var expect = require('chai').expect;
var pubsub = require('../pubsub')('62875455e3e2812b6e000001');

describe('board api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create boards', function (done) {
    pubsub.publishAwait('/boards/create', {
      board: { name: 'Board X' }
    }).then(function (message) {
      try {
        expect(message.board).to.exist;
        expect(message.board.id.length).to.equal(24);
        expect(message.board.createdByUserId).to.equal('12875455e3e2812b6e000001');
        expect(message.board.lanes).to.exist;
        expect(message.board.lanes.length).to.equal(4);
        expect(message.board.cardTypes).to.exist;
        expect(message.board.cardTypes.length).to.equal(3);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('cannot create duplicate boards', function (done) {
    pubsub.publishAwait('/boards/create', {
      board: { name: 'Board' }
    }).then(function (message) {
      done(new Error('Duplicat board created'));
    }, function (error) {
      try {
        expect(error.data.errorCode).to.equal(409);
        done();
      }
      catch (ex) { done(ex); }
    });
  });

  it('retrieves a board', function (done) {
    pubsub.publishAwait('/boards/get', {
      board: { id: '22875455e3e2812b6e000001' }
    }).then(function (message) {
      try {
        expect(message.board).to.exist;
        expect(message.board.name).to.equal('Board');
        expect(message.board.createdByUserId).to.equal('12875455e3e2812b6e000001');
        expect(message.board.createdOn).to.equal('2013-11-20T00:00:00.000Z');
        expect(message.board.lanes).to.exist;
        expect(message.board.lanes.length).to.equal(3);
        expect(message.board.cardTypes).to.exist;
        expect(message.board.cardTypes.length).to.equal(3);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('retrieves a board collection', function (done) {
    pubsub.publishAwait('/boards').then(function (message) {
      try {
        expect(message.boards).to.exist;
        expect(message.boards.length).to.equal(2);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('gives 404 for missing board', function (done) {
    pubsub.publishAwait('/boards/get', {
      board: { id: '22875455e3e2812b6e000099' }
    }).then(function (message) {
      done(new Error('Missing board returned'));
    }, function (error) {
      try {
        expect(error.data.errorCode).to.equal(404);
        done();
      }
      catch (ex) { done(ex); }
    });
  });

  // it('updates a board', function (done) {
  //   superagent.put(root + '/22875455e3e2812b6e000001').send({
  //     board: { name: 'Next Proj' }
  //   })
  //   .set('Cookie', 'session=62875455e3e2812b6e000001;')
  //   .end(function (err, res) {
  //     expect(err).to.equal(null);
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.exist;
  //     done();
  //   });
  // });

  it('removes a board', function (done) {
    pubsub.publishAwait('/boards/destroy', {
      board: { id: '22875455e3e2812b6e000001' }
    }).then(function (message) {
      pubsub.publishAwait('/boards/get', {
        board: { id: '22875455e3e2812b6e000001' }
      }).then(function (message) {
        done(new Error('Missing board returned'));
      }, function (error) {
        try {
          expect(error.data.errorCode).to.equal(404);
          done();
        }
        catch (ex) { done(ex); }
      });
    }, done);
  });

});
