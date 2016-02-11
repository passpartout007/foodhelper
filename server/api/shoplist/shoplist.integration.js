'use strict';

var app = require('../..');
import request from 'supertest';

var newShoplist;

describe('Shoplist API:', function() {

  describe('GET /api/shoplists', function() {
    var shoplists;

    beforeEach(function(done) {
      request(app)
        .get('/api/shoplists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shoplists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shoplists.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/shoplists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/shoplists')
        .send({
          name: 'New Shoplist',
          info: 'This is the brand new shoplist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newShoplist = res.body;
          done();
        });
    });

    it('should respond with the newly created shoplist', function() {
      newShoplist.name.should.equal('New Shoplist');
      newShoplist.info.should.equal('This is the brand new shoplist!!!');
    });

  });

  describe('GET /api/shoplists/:id', function() {
    var shoplist;

    beforeEach(function(done) {
      request(app)
        .get('/api/shoplists/' + newShoplist._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shoplist = res.body;
          done();
        });
    });

    afterEach(function() {
      shoplist = {};
    });

    it('should respond with the requested shoplist', function() {
      shoplist.name.should.equal('New Shoplist');
      shoplist.info.should.equal('This is the brand new shoplist!!!');
    });

  });

  describe('PUT /api/shoplists/:id', function() {
    var updatedShoplist;

    beforeEach(function(done) {
      request(app)
        .put('/api/shoplists/' + newShoplist._id)
        .send({
          name: 'Updated Shoplist',
          info: 'This is the updated shoplist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedShoplist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedShoplist = {};
    });

    it('should respond with the updated shoplist', function() {
      updatedShoplist.name.should.equal('Updated Shoplist');
      updatedShoplist.info.should.equal('This is the updated shoplist!!!');
    });

  });

  describe('DELETE /api/shoplists/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/shoplists/' + newShoplist._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when shoplist does not exist', function(done) {
      request(app)
        .delete('/api/shoplists/' + newShoplist._id)
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
