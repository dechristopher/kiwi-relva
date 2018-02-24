// kiwi/relva/modules/ops/grabSteamID.js - Created February 6th, 2018

// NPM Modules
const got = require('got');

// Custom Modules
const dlog = require('../util/dlog');

/**
 * CS:GO Hours Grabber
 * @param {string} steamID the Steam ID of the user in question
 * @returns {Promise<number>} hours in CS:GO (rounded)
 * @returns {Promise<number>} -1 if acccount doesn't own CS:GO
 */
module.exports = function(steamID) {
	return new Promise(function(resolve) {
		// Snag some info from random API we found to get hours
		got(`https://beta.decapi.me/steam/hours?id=${steamID}&appid=730`).then(resp => {
			if (resp.body.split(' ').indexOf('game') > -1) {
				resolve(-1);
			}
			const hours = parseInt(resp.body.split(' ')[0]);
			dlog(`[HOURS] ${steamID} -> ${hours} hours`);
			resolve(hours);
		});
	});
};