/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/recipes/:id/ingredients              ->  index
 * POST    /api/recipes/:id/ingredients              ->  create
 * GET     /api/recipes/:id/ingredients/:id          ->  show
 * PUT     /api/recipes/:id/ingredients/:id          ->  update
 * DELETE  /api/recipes/:id/ingredients/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Ingredient from './ingredient.model';
import Recipe from '../recipe/recipe.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Ingredients
export function index(req, res) {
  Ingredient.distinctAsync("name")
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets the whole ingredients list, with quantity if filled in, 0 otherwise
export function indexWholeList(req, res) {
  Ingredient.find({}, function (err, allIngredients) {
    if(err) {
      handleError(res);
    } else {
      // suppression des doublons
      var cache = {};
      allIngredients = allIngredients.filter(function(elem,index,array){
        return cache[elem.name]?0:cache[elem.name]=1;
      });
      for(var k in allIngredients) {
        allIngredients[k].quantity = "0";
      }
      //console.log(allIngredients);

      Ingredient.find({"recipe" : req.recipe._id}, function (err, recipeIngredients) {
        if(err) {
          handleError(res);
        } else {
          var finalReturn = [];
          //console.log(recipeIngredients);
          finalReturn = recipeIngredients.concat(allIngredients);
          var cache = {};
          finalReturn = finalReturn.filter(function(elem,index,array){
            return cache[elem.name]?0:cache[elem.name]=1;
          });
          res.json(finalReturn);
        }
      });
    }
  });
}

// Gets a single Ingredient from the DB
export function show(req, res) {
  Ingredient.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Ingredient in the DB
export function create(req, res) {
  var ingredient = new Ingredient(req.body);
  ingredient.recipe = req.recipe;
  ingredient.save(function(err, ingredient){
    if(err){ return next(err); }

    req.recipe.ingredients.push(ingredient);
    req.recipe.save(function(err, post) {
      if(err){ return next(err); }

      res.json(ingredient);
    });
  });
}

// Updates an existing Ingredient in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Ingredient.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Ingredient from the DB
export function destroy(req, res) {
  Recipe.find({"_id" : req.recipe._id}, function (err, recipes) {
    if(err) {
      handleError(res);
    } else {      
      var deleted = false;
      for(var k in recipes[0].ingredients) {
        if(recipes[0].ingredients[k] == req.params.id) {
          recipes[0].ingredients.splice(k, 1);
          deleted = true;
        }
      }
      if(deleted) {
        recipes[0].save(function(err, ingredient){
          if(err){ return next(err); }
        });
      }
    }
  });

  Ingredient.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
