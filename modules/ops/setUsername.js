// kiwi/relva/modules/ops/setUsername.js - Created February 13th, 2018

// Custom Modules
const log = require('../util/log');
const checkLinkedNoUsername = require('./checkLinkedNoUsername');
const checkUsernameValid = require('./checkUsernameValid');

/**
 * Username setter
 * @param {string} userID the Discord user ID of the user
 * @param {string} username the user's desired KIWI username
 * @param {Object} dbconn reference to the database connection
 * @param {boolean} debug debug mode
 * @returns {Promise<string>} response to user with result on resolve
 */
module.exports = function(userID, username, dbconn) {
	return new Promise(function(resolve) {
		// Ensure user has linked steam profile to discord user FIRST
		// - Error out if not
		// - Else run checks on username validity
		//      - If username invalid, error out
		//      - Else check to see if username already taken
		//          - If username taken, error out
		//          - Else set username in DB and then set user role to 'PUG User'
		checkLinkedNoUsername(userID, dbconn).then(linked => {
			if (!linked) {
				resolve('you have to link your SteamID with `!link <Steam Profile URL>` before setting your username.');
				return;
			}
			else {
				checkUsernameValid(username).then(valid => {
					if (!valid) {
						resolve('your desired username must only contain `letters`, `numbers`, `dashes`, and `underscores`, be `appropriate`, and must be `two or more characters long`.');
					}
					else {
						dbconn.query('SELECT steam_id FROM `users` WHERE `username` = ?', [username], function(checkError, checkResults) {
							if (checkError) {
								log('setUsername Error [0]: ' + checkError);
								resolve('sorry but something weird happened on our end. Contact `<@119966322523242497>` immediately and try again shortly. `[CODE: K91]`');
								return;
							}
							if (checkResults.length === 1) {
								resolve(`the username \`${username}\` is already taken. Try another.`);
							}
							else {
								dbconn.query('UPDATE `users` SET `username` = ? WHERE `discord_id` = ?', [username, userID], function(updateError) {
									if (updateError) {
										log('setUsername Error [1]: ' + updateError);
										resolve('sorry but something weird happened on our end. Contact `<@119966322523242497>` immediately and try again shortly. `[CODE: K92]`');
										return;
									}
									resolve(`your username was set successfully to \`${username}\`, you'll be removed from this channel shortly and added into the #kiwipugs channel. Use \`!help\` to learn how to use the PUG system. Have fun!`);
								});
							}
						});
					}
				});
			}
		});
	});
};