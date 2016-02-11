'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var shoplistCtrlStub = {
  index: 'shoplistCtrl.index',
  show: 'shoplistCtrl.show',
  create: 'shoplistCtrl.create',
  update: 'shoplistCtrl.update',
  destroy: 'shoplistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var shoplistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './shoplist.controller': shoplistCtrlStub
});

describe('Shoplist API Router:', function() {

  it('should return an express router instance', function() {
    shoplistIndex.should.equal(routerStub);
  });

  describe('GET /api/shoplists', function() {

    it('should route to shoplist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'shoplistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/shoplists/:id', function() {

    it('should route to shoplist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'shoplistCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/shoplists', function() {

    it('should route to shoplist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'shoplistCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/shoplists/:id', function() {

    it('should route to shoplist.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'shoplistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/shoplists/:id', function() {

    it('should route to shoplist.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'shoplistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/shoplists/:id', function() {

    it('should route to shoplist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'shoplistCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
