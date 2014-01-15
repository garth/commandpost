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

  it('updates a board', function (done) {
    pubsub.publishAwait('/boards/update', {
      board: {
        id: '22875455e3e2812b6e000001',
        name: 'Updated Board',
        defaultCardTypeId: '72875455e3e2812b6e001234',
        cardTypes: [
          {
            id: '72875455e3e2812b6e000001',
            name: 'Story',
            icon: 'book',
            pointScale: '1,2,3',
            priority: 0
          },
          {
            id: '72875455e3e2812b6e000002',
            name: 'Bug',
            icon: 'bug',
            pointScale: '',
            priority: 1
          },
          {
            id: '72875455e3e2812b6e001234', // new id
            name: 'ToDo',
            icon: 'cog',
            pointScale: '',
            priority: 0
          }
        ],
        lanes: [
          { id: '32875455e3e2812b6e000001', name: 'Updated One', order: 3 },
          { id: '32875455e3e2812b6e001234', name: '2nd', order: 2 }, // new id
          { id: '32875455e3e2812b6e000003', name: 'Three', order: 1 }
        ]
      }
    }).then(function (message) {
      try {
        var board = message.board;
        expect(board).to.exist;
        expect(board.name).to.equal('Updated Board');
        expect(board.createdByUserId).to.equal('12875455e3e2812b6e000001');
        expect(message.lanesNotDeleted).to.exist;
        expect(message.lanesNotDeleted.length).to.equal(1);
        expect(message.lanesNotDeleted[0]).to.equal('32875455e3e2812b6e000002');
        expect(message.cardTypesNotDeleted).to.exist;
        expect(message.cardTypesNotDeleted.length).to.equal(0);
        expect(board.lanes).to.exist;
        expect(board.lanes.length).to.equal(4); // extra lane added, deleted lane not empty
        expect(board).to.have.deep.property('lanes[3].name', '2nd');
        expect(board.cardTypes).to.exist;
        expect(board.cardTypes.length).to.equal(3);
        expect(board).to.have.deep.property('cardTypes[2].name', 'ToDo');
        expect(board.defaultCardTypeId).to.not.equal('72875455e3e2812b6e001234');
        expect(board.defaultCardTypeId).to.equal(board.cardTypes[2].id);
        done();
      }
      catch (ex) { done(ex); }
    }, done);
  });

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
