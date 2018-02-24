// kiwi/relva/modules/types/Solo.js - Created February 17th, 2018

// Custom Modules
const QueueEntity = require('./QueueEntity');

class Solo extends QueueEntity {

	/**
     * Creates a solo queue player QueueEntity
     * @param {GuildMember} player the solo player that is queued
     * @param {Object} params player configuration options
     */
	constructor(player, params = { region: 'us-e' }) {
		super({ type: 'solo', region: params.region });
		super.addMember(player);
	}
}

module.exports = Solo;