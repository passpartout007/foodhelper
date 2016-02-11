'use strict';

var app = require('../..');
import request from 'supertest';

var newIngredient;

describe('Ingredient API:', function() {

  describe('GET /api/recipes/:id/ingredients', function() {
    var ingredients;

    beforeEach(function(done) {
      request(app)
        .get('/api/recipes/:id/ingredients')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          ingredients = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ingredients.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/recipes/:id/ingredients', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/recipes/:id/ingredients')
        .send({
          name: 'New Ingredient',
          info: 'This is the brand new ingredient!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newIngredient = res.body;
          done();
        });
    });

    it('should respond with the newly created ingredient', function() {
      newIngredient.name.should.equal('New Ingredient');
      newIngredient.info.should.equal('This is the brand new ingredient!!!');
    });

  });

  describe('GET /api/recipes/:id/ingredients/:id', function() {
    var ingredient;

    beforeEach(function(done) {
      request(app)
        .get('/api/recipes/:id/ingredients/' + newIngredient._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          ingredient = res.body;
          done();
        });
    });

    afterEach(function() {
      ingredient = {};
    });

    it('should respond with the requested ingredient', function() {
      ingredient.name.should.equal('New Ingredient');
      ingredient.info.should.equal('This is the brand new ingredient!!!');
    });

  });

  describe('PUT /api/recipes/:id/ingredients/:id', function() {
    var updatedIngredient;

    beforeEach(function(done) {
      request(app)
        .put('/api/recipes/:id/ingredients/' + newIngredient._id)
        .send({
          name: 'Updated Ingredient',
          info: 'This is the updated ingredient!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedIngredient = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedIngredient = {};
    });

    it('should respond with the updated ingredient', function() {
      updatedIngredient.name.should.equal('Updated Ingredient');
      updatedIngredient.info.should.equal('This is the updated ingredient!!!');
    });

  });

  describe('DELETE /api/recipes/:id/ingredients/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/recipes/:id/ingredients/' + newIngredient._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ingredient does not exist', function(done) {
      request(app)
        .delete('/api/recipes/:id/ingredients/' + newIngredient._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
