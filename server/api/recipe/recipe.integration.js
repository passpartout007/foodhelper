'use strict';

var app = require('../..');
import request from 'supertest';

var newRecipe;

describe('Recipe API:', function() {

  describe('GET /api/recipes', function() {
    var recipes;

    beforeEach(function(done) {
      request(app)
        .get('/api/recipes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          recipes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      recipes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/recipes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/recipes')
        .send({
          name: 'New Recipe',
          rating: 4,
          imagePath: 'chemin/vers/image',
          description: 'New description', 
          accepted: '',
          archive: '',
          ingredients : [],
          creationDate: '',
          boughtDate: ''
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRecipe = res.body;
          done();
        });
    });

    it('should respond with the newly created recipe', function() {
      newRecipe.name.should.equal('New Recipe');
      newRecipe.rating.should.equal(4);
    });

  });

  describe('GET /api/recipes/:id', function() {
    var recipe;

    beforeEach(function(done) {
      request(app)
        .get('/api/recipes/' + newRecipe._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          recipe = res.body;
          done();
        });
    });

    afterEach(function() {
      recipe = {};
    });

    it('should respond with the requested recipe', function() {
      recipe.name.should.equal('New Recipe');
      recipe.rating.should.equal(4);
    });

  });

  describe('PUT /api/recipes/:id', function() {
    var updatedRecipe;

    beforeEach(function(done) {
      request(app)
        .put('/api/recipes/' + newRecipe._id)
        .send({
          name: 'New Recipe',
          rating: 5,
          imagePath: 'chemin/vers/image',
          description: 'New description', 
          accepted: '',
          archive: '',
          ingredients : [],
          creationDate: '',
          boughtDate: ''
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRecipe = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRecipe = {};
    });

    it('should respond with the updated recipe', function() {
      updatedRecipe.name.should.equal('New Recipe');
      updatedRecipe.rating.should.equal(5);
    });

  });

  describe('DELETE /api/recipes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/recipes/' + newRecipe._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when recipe does not exist', function(done) {
      request(app)
        .delete('/api/recipes/' + newRecipe._id)
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
