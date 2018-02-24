// kiwi/relva/modules/ops/checkLinkedNoUsername.js - Created February 15th, 2018

// Custom Modules
const log = require('../util/log');

/**
 * Account link checker (no username set)
 * @param {string} userID the user's Discord ID
 * @param {Object} dbconn reference to the database connection
 * @param {boolean} debug debug mode
 * @returns {Promise<boolean>} whether or not the user has a Steam account linked
 */
module.exports = function(userID, dbconn) {
	return new Promise(function(resolve) {
		// Ensure user has a profile linked and has not set their username yet
		dbconn.query('SELECT steam_id FROM `users` WHERE `discord_id` = ?', [userID], function(error, results) {
			// if (debug) { log(`${userID} ${results} ${results[0].steam_id !== undefined}`); }
			if (error) {
				log(error);
				resolve('Sorry, something weird happened on our end. Contact `<@119966322523242497>` immediately and try again shortly. `[CODE: K68.5]`');
				return;
			}
			resolve((results.length === 1) ? true : false);
		});
	});
};