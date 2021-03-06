// kiwi/relva/modules/ops/grabSteamID.js - Created February 6th, 2018

// NPM Modules
const got = require('got');
const parser = require('xml2js').parseString;
const steam = require('steamidconvert')();

// Custom Modules
const log = require('../util/log');
const dlog = require('../util/dlog');

/**
 * Steam URL to SteamIDs parser
 * @param {string} steamURL the user's steam profile URL
 * @returns {Promise<Object>} nugget
 *  nugget.error (if any)
 *  nugget.ids {
 *      steamid: 'STEAM_0:0:39990',
 *      steamid64: '76561197960345708',
 *      steamid3: '[U:1:79980]'
 *  }
 */
module.exports = function(steamURL) {
	return new Promise(function(resolve) {
		const nugget = {};
		// Snag some info from the XML API
		got(`${steamURL}?xml=1`).then(resp => {
			dlog('Hit Steam XML -> ' + steamURL);
			// Parse the XML as JSON
			parser(resp.body, (err, results) => {
				if (err) {
					log(`[SID PARSE ERROR] ${steamURL} -> ${err}`);
					nugget.error = 'Failed to parse Steam Profile URL. Please try again later on after contacting `<@119966322523242497>` immediately. [CODE: K76]';
					nugget.ids = {};
					resolve(nugget);
				}
				nugget.error = undefined;
				// Convert the steamID64 into the other two formats
				nugget.ids = {
					steamid: steam.convertToText(results.profile.steamID64[0]),
					steamid64: results.profile.steamID64[0],
					steamid3: steam.convertToNewFormat(steam.convertToText(results.profile.steamID64[0])),
				};
				resolve(nugget);
			});
		});
	});
};