// kiwi/relva/modules/queue.js - Created February 16th, 2018

// NPM Modules
let Collection = require('discord.js').Collection;

// Core Modules
const util = require('util');
const EventEmitter = require('events');

class Queue {
    constructor() {
        EventEmitter.call(this);
        /**
         * @type {Collection<string, QueueEntity>}
         */
        this.queue = new Collection();
    }

    // Emits a single event with no payload
    emitOne(type) {
        this.emit(type);
    }
}

// Inherit prototypes from EventEmitter
// so we get .on() and .emit()
util.inherits(Queue, EventEmitter);

module.exports = Queue;