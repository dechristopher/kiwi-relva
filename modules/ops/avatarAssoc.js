// kiwi/relva/modules/ops/avatarAssoc.js - Created February 6th, 2018

// Custom Modules
const dlog = require('../util/dlog');

/**
 * Avatar Association Algorithm: doc/avatar-association-algorithm.txt
 * Non-promisified and no return. Happens in the background regardless of result
 * @param {string} userID the user's Discord ID
 * @param {string} avatarURL link to the user's Discord avatar
 * @param {Object} dbconn reference to the database connection
 * @param {Object} cconn reference to the cache connection
 */
module.exports = function(userID, avatarURL, dbconn, cconn) {
	// Check to see if the cache contains an entry for the user's avatar
	cconn.hexists('avatars', userID, function(err, reply) {
		dlog(`Avatar Exists (${userID}): ${reply}`);
		if (reply === 1) {
			// Get the avatar URL from the cache to check if it's the same
			cconn.hget('avatars', userID, function(err, getReply) {
				if (getReply === avatarURL) {
					// Do nothing :D
					dlog(`Avatar for ${userID} already set properly. Not hitting db.`);
					return;
				}
				else {
					// Update the changed avatar in the database
					dbconn.query('UPDATE `users` SET `discord_avatar_url` = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error) {
						dlog(`Set ${userID} avatar to ${avatarURL} in db`);
						if (error) {
							dlog(`Set avatar in db ERROR: ${error}`);
						}
					});
					// Update the changed avatar in the cache
					cconn.hset('avatars', userID, avatarURL, function(error) {
						dlog(`Set ${userID} avatar to ${avatarURL} in cache`);
						if (error) {
							dlog(`Set avatar in cache ERROR: ${error}`);
						}
					});
				}
			});
		}
		else {
			// Set the avatar in the database
			dbconn.query('UPDATE `users` SET `discord_avatar_url` = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error) {
				dlog(`Set ${userID} avatar to ${avatarURL} in db`);
				if(error) {
					dlog(`Set avatar in db ERROR: ${error}`);
				}
			});
			// Set the avatar in the cache
			cconn.hset('avatars', userID, avatarURL, function(error) {
				dlog(`Set ${userID} avatar to ${avatarURL} in cache`);
				if (error) {
					dlog(`Set avatar in cache ERROR: ${error}`);
				}
			});
		}
	});
};