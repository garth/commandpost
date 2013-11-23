var superagent = require('superagent');
var expect = require('chai').expect;
var root = 'http://localhost:3001/api/projects';

describe('projects rest api', function () {

  beforeEach(function (done) {
    require('./fixtures')(done);
  });

  it('can create projects', function (done) {
    superagent.post(root).send({
      project: { name: 'Project X' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.project).to.exist;
      expect(res.body.project.id.length).to.equal(24);
      expect(res.body.project.createdByUser).to.equal('12875455e3e2812b6e000001');
      done();
    });
  });

  it('cannot create duplicate projects', function (done) {
    superagent.post(root).send({
      project: { name: 'Project' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(409);
      done();
    });
  });

  it('retrieves a project', function (done) {
    superagent.get(root + '/22875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.project).to.exist;
      expect(res.body.project.name).to.equal('Project');
      expect(res.body.project.createdByUser).to.equal('12875455e3e2812b6e000001');
      expect(res.body.project.createdOn).to.equal('2013-11-20T00:00:00.000Z');
      done();
    });
  });

  it('retrieves a project collection', function (done) {
    superagent.get(root)
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      expect(res.body.projects).to.exist;
      expect(res.body.projects.length).to.equal(2);
      done();
    });
  });

  it('updates a project', function (done) {
    superagent.put(root + '/22875455e3e2812b6e000001').send({
      project: { name: 'Next Proj' }
    })
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

  it('removes a project', function (done) {
    superagent.del(root + '/22875455e3e2812b6e000001')
    .set('Cookie', 'session=62875455e3e2812b6e000001;')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).to.equal(200);
      expect(res.body).to.exist;
      done();
    });
  });

});
