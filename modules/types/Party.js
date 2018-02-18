// kiwi/relva/modules/types/Party.js - Created February 17th, 2018

// Custom Modules
let QueueEntity = require('./QueueEntity.js');

// Custom Modules
let genID = require('../util/genID.js');

/**
 * A QueueEntity that handles parties of multiple players
 * @extends {QueueEntity}
 */
class Party extends QueueEntity {

    /**
     * Creates a Party QueueEntity
     * @param {GuildMember} leader
     * @param {Object} params party configuration options
     */
    constructor(leader, params = { region: "us-e" }) {
        super({ type: "party", region: params.region });
        super.addMember(leader);
        this.leader = leader;
        this.joinCode = genID(4, { prefix: false });
    }

    /**
     * @returns {string} the leader's id
     */
    leaderID() {
        return this.leader.id;
    }

    /**
     * Sets a member of the party as the group leader
     * @param {GuildMember} member
     */
    newLeader(member) {
        this.leader = member;
    }

    /**
     * @returns {string} the newly generated join code of the party
     */
    newJoinCode() {
        this.joinCode = genID(4, { prefix: false });
        return this.joinCode;
    }

}

module.exports = Party;