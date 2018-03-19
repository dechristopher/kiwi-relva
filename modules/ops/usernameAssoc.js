// kiwi/relva/modules/ops/usernameAssoc.js - Created March 15th, 2018

// Custom Modules
const dlog = require('../util/dlog');

/**
 * Sets the user's Discord nickname to their KIWI username
 * @param {GuildMember} user the Discord user
 * @param {Object} dbconn the database connection
 */
module.exports = function(user, guild, dbconn) {
	dbconn.query('SELECT username FROM `users` WHERE `discord_id` = ?', [user.id], function(error, results) {
		if (error) {
			dlog(`[uAssoc] Set username DB ERROR: ${error}`);
			return;
		}
		else {
			guild.fetchMember(user).then(member => {
				dlog(`[uAssoc] Checking ${member.nickname} = ${results[0].username}`);
				if (member.nickname !== results[0].username) {
					dlog(`[uAssoc] Changing ${member.nickname} -> ${results[0].username}`);
					member.setNickname(results[0].username);
				}
			});
		}
	});
};