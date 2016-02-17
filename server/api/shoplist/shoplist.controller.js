/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shoplists              ->  index
 * POST    /api/shoplists              ->  create
 * GET     /api/shoplists/:id          ->  show
 * PUT     /api/shoplists/:id          ->  update
 * DELETE  /api/shoplists/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Shoplist = require('./shoplist.model');
var Recipe = require('../recipe/recipe.model');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://passpartout007%40gmail.com:Support2222@smtp.gmail.com');

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

// Gets a list of Shoplists
export function index(req, res) {
  Shoplist.find()
    .populate("recipes")
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Shoplist from the DB
export function show(req, res) {
  Shoplist.findById(req.params.shoplist)
    .populate("recipes")
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Shoplist in the DB
export function create(req, res) {
  Shoplist.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Shoplist in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Shoplist.findByIdAsync(req.params.shoplist)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Adds a recipe to the shoplist
export function addRecipe(req, res) {
  if(req.shoplist) {
    var recipes = JSON.parse(req.body.id);
    for(var k in recipes) {
      var alreadyIn = req.shoplist.recipes.find(function(element, index, array) {return element == recipes[k]});
      if(!alreadyIn) {
        req.shoplist.recipes.push(recipes[k]);
        Recipe.findById(recipes[k], function (err, aRecipe) {
          if(err) {
            handleError(res);
          } else {
            aRecipe.accepted = false;
            aRecipe.save(function(err, recipe) {
              if(err){ return next(err); }
            }); 
          }
        });
        
      }
    }
    req.shoplist.save(function(err, shoplist) {
      if(err){ return next(err); }
      show(req, res);
    }); 
  }
}

// Deletes a Shoplist from the DB
export function destroy(req, res) {
  Shoplist.findByIdAsync(req.params.shoplist)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Deletes a recipe from a shoplist in the DB
export function destroyRecipe(req, res) {
  var deleted = false;
  for(var k in req.shoplist.recipes) {
    if(req.shoplist.recipes[k] == req.params.recipe) {
      req.shoplist.recipes.splice(k, 1);
      deleted = true;
    }
  }
  if(deleted) {
    req.shoplist.save(function(err, shoplist){
      if(err){ return next(err); }
      res.status(204).end();
    });
  }  
}

// Sends a mail with the shoplist
export function sendMail(req, res) {
  if(req.shoplist) {
    console.log(req.body);
    var mailOptions = {
      from: "pierre.lesecq@gmail.com",
      to: "pierre.lesecq@gmail.com",
      subject: "test",
      text: "Voila un contenu",
      html: '<b>Ca cest du html</b>'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
    transporter.close();
  }
} 

