// kiwi/relva/modules/types/QueueEntity.js - Created February 17th, 2018

// NPM Modules
let Collection = require('discord.js').Collection;

// Custom Modules
let genID = require('../util/genID.js');

class QueueEntity {
    /**
     * params:
     * {
     *  type: (string) "solo"/"party" (default: solo)
     *  region: (string) "us-e" (default: us-e)
     * }
     */
    constructor(params = { type: "solo", region: "us-e" }) {
        // Solo or party
        this.type = params.type;
        // Randomly generated entityID
        this.id = genID(7);
        /**
         * A collection of party members
         * @type {Collection<string, GuildMember (discord.js)>}
         * key: Guild Member ID
         */
        this.members = new Collection();
    }

    /**
     * @returns {number} the number of members the QueueEntity has
     */
    size() {
        return this.members.size;
    }

    /**
     * Adds a player to the members list in the QueueEntity
     * @param {GuildMember} member the GuildMember object
     */
    addMember(member) {
        this.members.set(member.id, member);
    }
}

module.exports = QueueEntity;