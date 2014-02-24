var expect = require('chai').expect;
var pubsub = require('../pubsub')('62875455e3e2812b6e000001');

describe('release api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create releases', function (done) {
    pubsub.publishAwait('/releases/create', {
      release: {
        boardId: '22875455e3e2812b6e000001',
        version: 'v1.0.0-beta.2',
        cards: [
          { laneId: '32875455e3e2812b6e000001', id: '42875455e3e2812b6e000001' },
          { laneId: '32875455e3e2812b6e000001', id: '42875455e3e2812b6e000002' },
          { laneId: '32875455e3e2812b6e000001', id: '42875455e3e2812b6e000003' },
          { laneId: '32875455e3e2812b6e000002', id: '42875455e3e2812b6e000005' }
        ]
      }
    }).then(function (message) {
      try {
        expect(message.release).to.exist;
        expect(message.release.id.length).to.equal(24);
        expect(message.release.createdByUserId).to.equal('12875455e3e2812b6e000001');
        expect(message.release.cards).to.exist;
        expect(message.release.cards.length).to.equal(4);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('retrieves a release', function (done) {
    pubsub.publishAwait('/releases/get', {
      release: { id: '82875455e3e2812b6e000001' }
    }).then(function (message) {
      try {
        expect(message.release).to.exist;
        expect(message.release.version).to.equal('v1.0.0-beta.1');
        expect(message.release.createdByUserId).to.equal('12875455e3e2812b6e000001');
        expect(message.release.createdOn).to.equal('2014-02-20T00:00:00.000Z');
        expect(message.release.cards).to.exist;
        expect(message.release.cards.length).to.equal(3);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('retrieves a release collection', function (done) {
    pubsub.publishAwait('/releases', {
      board: { id: '22875455e3e2812b6e000001' }
    }).then(function (message) {
      try {
        expect(message.releases).to.exist;
        expect(message.releases.length).to.equal(2);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('gives 404 for missing release', function (done) {
    pubsub.publishAwait('/releases/get', {
      release: { id: '82875455e3e2812b6e000099' }
    }).then(function (message) {
      done(new Error('Missing release returned'));
    }, function (error) {
      try {
        expect(error.data.errorCode).to.equal(404);
        done();
      }
      catch (ex) { done(ex); }
    });
  });

});
