/**
 * Shoplist model events
 */

'use strict';

import {EventEmitter} from 'events';
var Shoplist = require('./shoplist.model');
var ShoplistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ShoplistEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Shoplist.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ShoplistEvents.emit(event + ':' + doc._id, doc);
    ShoplistEvents.emit(event, doc);
  }
}

module.exports = ShoplistEvents;
