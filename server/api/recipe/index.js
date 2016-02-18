'use strict';

var Recipe = require('./recipe.model');

var express = require('express');
var controllerRecipe = require('./recipe.controller');
var controllerIngredient = require('../ingredient/ingredient.controller');

var router = express.Router();

router.get('/', controllerRecipe.index);
router.get('/:recipe', controllerRecipe.show);
router.post('/', controllerRecipe.create);
router.put('/:recipe', controllerRecipe.update);
router.patch('/:recipe', controllerRecipe.update);
router.delete('/:recipe', controllerRecipe.destroy);

module.exports = router;
