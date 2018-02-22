// kiwi/relva/modules/util/checkPriv.js - Created on February 22nd, 2018

// Core Modules
const fs = require('fs');

// Privilege file
const priv = JSON.parse(fs.readFileSync('./priv.json'));

/**
 * Checks for and returns a user's privilege level
 * @param {string} [id] the userID to check
 */
module.exports = (id) => {
	for (let i = 0; i < priv.users.length; i++) {
		if (priv.users[i].userID == id) {
			return priv.users[i].level;
		}
	}
	return 0;
};