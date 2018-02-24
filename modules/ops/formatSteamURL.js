// kiwi/relva/modules/ops/formatSteamURL.js - Created February 14th, 2018

// Custom Modules
const dlog = require('../util/log');

/**
 * SteamProfile URL formatter
 * @param {string} steamURL the Steam profile URL to format
 * @returns {Promise<string>} formatted Steam profile URL
 */
module.exports = function(steamURL) {
	const stripWWW = function(steamURLWWW) {
		return new Promise(function(resolve) {
			// Strip www. from URL (because it breaks everything)
			if (steamURLWWW.includes('www.')) {
				dlog('[SProf] has www.');
				steamURLWWW = steamURLWWW.replace('www.', '');
				resolve(steamURLWWW);
				return;
			}
			resolve(steamURLWWW);
		});
	};

	const replaceHTTP = function(steamURLHTTP) {
		return new Promise(function(resolve) {
			// Add https:// if URL doesn't contain it
			if (steamURLHTTP.includes('http://')) {
				dlog('[SProf] has replace http with https');
				steamURLHTTP = steamURLHTTP.replace('http://', 'https://');
				resolve(steamURLHTTP);
				return;
			}
			resolve(steamURLHTTP);
		});
	};

	const addHTTPS = function(steamURLHTTPS) {
		return new Promise(function(resolve) {
			// Add https:// if URL doesn't contain it
			if (!steamURLHTTPS.includes('https://') && !steamURLHTTPS.includes('http://')) {
				// console.log('has www.');
				steamURLHTTPS = 'https://' + steamURLHTTPS;
				resolve(steamURLHTTPS);
				return;
			}
			resolve(steamURLHTTPS);
		});
	};

	// Run formatting
	return new Promise(function(resolve) {
		stripWWW(steamURL).then(urlwww => {
			replaceHTTP(urlwww).then(urlhttp => {
				addHTTPS(urlhttp).then(urlhttps => {
					resolve(urlhttps);
				});
			});
		});
	});
};