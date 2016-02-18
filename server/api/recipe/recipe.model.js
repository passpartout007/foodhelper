'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var RecipeSchema = new mongoose.Schema({
  name: String,
  rating: {type: Number, default: 0},
  imagePath: String,
  description: String,
  accepted: { type: Boolean, default: false }, 
  archive: { type: Boolean, default: false}, 
  ingredients: [ {type : mongoose.Schema.ObjectId, ref : 'Ingredient'} ], 
  creationDate: { type: Date, default: Date.now },
  boughtDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
