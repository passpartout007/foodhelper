'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ingredientCtrlStub = {
  index: 'ingredientCtrl.index',
  show: 'ingredientCtrl.show',
  create: 'ingredientCtrl.create',
  update: 'ingredientCtrl.update',
  destroy: 'ingredientCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ingredientIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './ingredient.controller': ingredientCtrlStub
});

describe('Ingredient API Router:', function() {

  it('should return an express router instance', function() {
    ingredientIndex.should.equal(routerStub);
  });

  describe('GET /api/recipes/:id/ingredients', function() {

    it('should route to ingredient.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ingredientCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/recipes/:id/ingredients/:id', function() {

    it('should route to ingredient.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ingredientCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/recipes/:id/ingredients', function() {

    it('should route to ingredient.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ingredientCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/recipes/:id/ingredients/:id', function() {

    it('should route to ingredient.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ingredientCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/recipes/:id/ingredients/:id', function() {

    it('should route to ingredient.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ingredientCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/recipes/:id/ingredients/:id', function() {

    it('should route to ingredient.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ingredientCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
