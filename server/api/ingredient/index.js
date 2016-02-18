'use strict';

var express = require('express');
var controller = require('./ingredient.controller');
var Recipe = require('../recipe/recipe.model');

var router = express.Router();

router.param('recipe', function(req, res, next, id) {
	var query = Recipe.findById(id);
	
	query.exec(function (err, recipe){
	    if (err) { return next(err); }
	    if (!recipe) { return next(new Error('can\'t find recipe')); }

	    req.recipe = recipe;
		return next();
	});
});

router.get('/:recipe/ingredients', controller.indexWholeList);
router.get('/:recipe/ingredients/:id', controller.show);
router.post('/:recipe/ingredients/', controller.create);
router.put('/:recipe/ingredients/:id', controller.update);
router.patch('/:recipe/ingredients/:id', controller.update);
router.delete('/:recipe/ingredients/:id', controller.destroy);

module.exports = router;
