'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ShoplistSchema = new mongoose.Schema({
  name: String,
  recipes: [ {type : mongoose.Schema.ObjectId, ref : 'Recipe'} ], 
  boughtDate: { type: Date, default: Date.now }, 
  archive: { type: Boolean, default: false}
});

module.exports = mongoose.model('Shoplist', ShoplistSchema);
