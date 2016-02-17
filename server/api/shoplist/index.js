'use strict';

var express = require('express');
var controller = require('./shoplist.controller');
var Shoplist = require('../shoplist/shoplist.model');
var Recipe = require('../recipe/recipe.model');
var router = express.Router();

router.param('shoplist', function(req, res, next, id) {
	var query = Shoplist.findById(id);
	
	query.exec(function (err, shoplist){
	    if (err) { return next(err); }
	    if (!shoplist) { return next(new Error('can\'t find shoplist')); }

	    req.shoplist = shoplist;
		return next();
	});
});

router.get('/', controller.index);
router.get('/:shoplist', controller.show);
router.post('/:shoplist/recipes/', controller.addRecipe);
router.post('/', controller.create);
router.post('/:shoplist/mail', controller.sendMail);
router.put('/:shoplist', controller.update);
router.patch('/:shoplist', controller.update);
router.delete('/:shoplist', controller.destroy);
router.delete('/:shoplist/recipes/:recipe', controller.destroyRecipe);

module.exports = router;
