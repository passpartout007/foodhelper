/**
 * Ingredient model events
 */

'use strict';

import {EventEmitter} from 'events';
var Ingredient = require('./ingredient.model');
var IngredientEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
IngredientEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Ingredient.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    IngredientEvents.emit(event + ':' + doc._id, doc);
    IngredientEvents.emit(event, doc);
  }
}

module.exports = IngredientEvents;
