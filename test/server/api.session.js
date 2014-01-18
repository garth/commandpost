var expect = require('chai').expect;
var pubsub = require('../pubsub')('62875455e3e2812b6e000001');

describe('sessions api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create a session', function (done) {
    pubsub.publishAwait('/session/create', {
      name: 'garth',
      password: 'test'
    }).then(function (message) {
      try {
        expect(message.sessionId).to.exist;
        expect(message.sessionId.length).to.equal(24);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('gets the current session', function (done) {
    pubsub.publishAwait('/session/get').then(function (message) {
      try {
        expect(message.user).to.exist;
        expect(message.user.name).to.equal('Garth');
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('can delete a session', function (done) {
    pubsub.publishAwait('/session/delete', {
      sessionId: '62875455e3e2812b6e000001'
    }).then(function (message) {
      try {
        expect(message).to.exist;
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('cannot delete a session when not authenticated', function (done) {
    var pubsubNoSession = require('../pubsub')();
    pubsubNoSession.subscribeToClient('/error/session', function (message) {
      try {
        expect(message.errorCode).to.equal(401);
        done();
      }
      catch (ex) { done(ex); }
    }).then(function () {
      pubsubNoSession.publishAwait('/session/delete', {
        sessionId: '62875455e3e2812b6e000001'
      }).then(function (message) {
        done(new Error('Invalid session deleted'));
      }, function (error) {
        done(new Error('Delete session returned error'));
      });
    });
  });

  it('cannot delete a session with an invalid id', function (done) {
    pubsub.publishAwait('/session/delete', {
      sessionId: '62875455e3e2812b6e000099'
    }).then(function (message) {
      done(new Error('Invalid session deleted'));
    }, function (error) {
      try {
        expect(error.data.errorCode).to.equal(404);
        done();
      }
      catch (ex) { done(ex); }
    });
  });

});
