// kiwi/relva/modules/ops/checkUsernameValid.js - Created February 15th, 2018

// Custom Modules
const dlog = require('../util/dlog.js');

/**
 * Username validity checker
 * @param {string} username the username to check
 * @returns {Promise<boolean>} whether or not the username is valid
 */
module.exports = function(username) {
	return new Promise(function(resolve) {
		// Ensure user has provided a valid username:
		//  - alpha-numerics, underscores, and dashes only
		//  - more than two characters
		const usernameRegex = /^[a-zA-Z0-9-_]+$/;
		const result = (usernameRegex.test(username)) && (username.length >= 2);
		dlog(`${username} valid? ${result}`);
		resolve(result);
	});
};