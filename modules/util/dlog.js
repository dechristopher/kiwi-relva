// kiwi/relva/modules/util/dlog.js - Created February 19th, 2018

// NPM Modules
const log = require('./log');
const c = require('chalk');

// Static variables
const DEBUG = `[${c.cyan('debug')}] `;

/**
 * Logs a debug message to STDOUT only if debugging
 * @param {string} message a debug message to log
 * @returns {Promise<string>} a promise containing the string that was logged
 * @returns {Promise<error>} on log rejection
 */
module.exports = (message) => {
	if (process.env.DEBUG === 'true') {
		return new Promise(function(resolve, reject) {
			log(`${DEBUG}${message}`).then(() => resolve(message)).catch(error => reject(error));
		});
	}
};