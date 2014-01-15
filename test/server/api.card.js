var expect = require('chai').expect;
var pubsub = require('../pubsub')('62875455e3e2812b6e000001');

describe('cards api', function () {

  beforeEach(function (done) {
    require('../fixtures')(done);
  });

  it('can create boards', function (done) {
    pubsub.publishAwait('/cards/create', {
      board: { id: '22875455e3e2812b6e000001' },
      lane: { id: '32875455e3e2812b6e000001' },
      card: {
        cardTypeId: '72875455e3e2812b6e000001',
        title: 'Amazing Thing'
      }
    }).then(function (message) {
      try {
        expect(message.card).to.exist;
        expect(message.card.id.length).to.equal(24);
        expect(message.card.history).to.exist;
        expect(message.card.history[0].userId).to.equal('12875455e3e2812b6e000001');
        expect(message.card.history[0].action).to.equal('create');
        expect(message.card.history[0].laneName).to.equal('One');
        expect(message.card.title).to.equal('Amazing Thing');
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

  it('updates a card', function (done) {
    var sub = pubsub.subscribe('/boards/22875455e3e2812b6e000001/cards', function (message) {
      try {
        sub.cancel();
        expect(message.action).to.equal('update');
        expect(message.card).to.exist;
        expect(message.card.id).to.equal('42875455e3e2812b6e000001');
        expect(message.card.title).to.equal('new title');
        done();
      }
      catch (ex) { done(ex); }
    });
    pubsub.publishAwait('/cards/update', {
      board: { id: '22875455e3e2812b6e000001' },
      lane: { id: '32875455e3e2812b6e000001' },
      card: {
        id: '42875455e3e2812b6e000001',
        title: 'new title'
      }
    }).then(function (message) {}, done);
  });

  it('removes a card', function (done) {
    var moved = false;
    var destroyed = false;
    var sub = pubsub.subscribe('/boards/22875455e3e2812b6e000001/cards', function (message) {
      try {
        if (message.action === 'destroy') {
          moved = true;
          expect(message.action).to.equal('destroy');
          expect(message.card).to.exist;
          expect(message.card.id).to.equal('42875455e3e2812b6e000001');
        }
        if (message.action === 'move') {
          destroyed = true;
          console.log(message);
        }
        if (moved && destroyed) {
          sub.cancel();
          done();
        }
      }
      catch (ex) { done(ex); }
    });
    pubsub.publishAwait('/cards/destroy', {
      board: { id: '22875455e3e2812b6e000001' },
      lane: { id: '32875455e3e2812b6e000001' },
      card: { id: '42875455e3e2812b6e000001' }
    }).then(function (message) {}, done);
  });

});
