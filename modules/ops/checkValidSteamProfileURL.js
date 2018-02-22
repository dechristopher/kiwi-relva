// kiwi/relva/modules/ops/checkValidSteamProfileURL.js - Created February 14th, 2018

// Custom Modules
const dlog = require('../util/dlog.js');

/**
 * SteamProfile URL checker
 * @param {string} steamURL the Steam profile URL to check
 * @returns {Promise<boolean>} whether or not the Steam profuile URL is valid
 */
module.exports = function(steamURL) {
	// Steam Profile URL Regex
	const steamURLReg = new RegExp('(?:https?://)?steamcommunity.com/(?:profiles|id)/[a-zA-Z0-9]+');
	// Run checks
	return new Promise(function(resolve) {
		// Ensure the given Steam Profile URL is valid
		const result = steamURLReg.test(steamURL);
		dlog(`${steamURL} valid? ${result}`);
		resolve(result);
	});
};