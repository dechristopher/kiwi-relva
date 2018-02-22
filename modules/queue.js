// kiwi/relva/modules/queue.js - Created February 16th, 2018

// NPM Modules
const Collection = require('discord.js').Collection;

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

	/**
     * Emits a single event with no payload
     * @param {string} type type of event
     */
	emitOne(type) {
		this.emit(type);
	}
}

// Inherit prototypes from EventEmitter
// so we get .on() and .emit()
util.inherits(Queue, EventEmitter);

module.exports = Queue;