let Collection = require('discord.js').Collection;

class KV {
    constructor() {
        /**
         * All of the {@link Party} objects that have been cached at any point, mapped by their IDs
         * @type {Collection<string, Party>}
         */
        this.parties = new Collection();

        /**
         * @type {Collection<string, Channel>}
         */
        this.matchRooms = new Collection();

        /**
         * @type {Collection<string, QueueEntity>}
         */
        this.queue = new Collection();
    }

    parties() {
        return this.parties;
    }

    matchRooms() {
        return this.matchRooms;
    }

    queue() {
        return this.queue;
    }
}

module.exports = KV;