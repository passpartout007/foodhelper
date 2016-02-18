/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/recipes              ->  index
 * POST    /api/recipes              ->  create
 * GET     /api/recipes/:id          ->  show
 * PUT     /api/recipes/:id          ->  update
 * DELETE  /api/recipes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Recipe = require('./recipe.model');

var fs = require('fs');

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

// Gets a list of Recipes
module.exports.index = function (req, res) {
  Recipe.find()
    .populate("ingredients")
    .execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Recipe from the DB
module.exports.show = function (req, res) {
  Recipe.findById(req.params.recipe)
    .populate("ingredients")
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Recipe in the DB
module.exports.create = function (req, res) {
  Recipe.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Recipe in the DB
module.exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Recipe.findByIdAsync(req.params.recipe)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Recipe from the DB
module.exports.destroy = function (req, res) {
  Recipe.findByIdAsync(req.params.recipe)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
