'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var IngredientSchema = new mongoose.Schema({
  name: String,
  recipe: {type : mongoose.Schema.ObjectId, ref : 'Recipe'}, 
  archive: { type: Boolean, default: false}, 
  quantity: String
});

export default mongoose.model('Ingredient', IngredientSchema);
