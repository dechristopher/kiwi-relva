// kiwi/relva/modules/user.js - Created February 6th, 2018

// Custom Modules
const log = require('./util/log.js');
const dlog = require('./util/dlog.js');

// Operation Modules
const opAvatarAssoc = require('./ops/avatarAssoc.js');
const opCheckLinked = require('./ops/checkLinked.js');
const opLinkAccount = require('./ops/linkAccount.js');
const opSetUsername = require('./ops/setUsername.js');

// Data Operation Modules
const opGetUserSteamID = require('./ops/data/getUserSteamID.js');
const opGetUserName = require('./ops/data/getUserName.js');

class User {
	/**
     *
     * @param {Client} bot Discord bot object
     * @param {Object} dbOptions database connection options
     * @param {Object} cacheOptions cache connection options
     */
	constructor(bot, dbOptions, cacheOptions) {
		this.bot = bot;
		this.dbc = new (require('./service/dbc.js'))(dbOptions);
		this.cache = new (require('./service/cache.js'))(cacheOptions);
		this.debug = process.env.DEBUG;
	}

	/**
     * Checks to see if a userID has a linked steam account and username set
     * @param {string} userID the user's Discord ID
     * @returns {Promise<boolean>} whether or not the user is linked
     */
	checkLinked(userID) {
		return opCheckLinked(userID, this.dbc.conn());
	}

	linkAccount(username, userID, steamURL) {
		const dbconn = this.dbc.conn();
		return new Promise(function(resolve) {
			opLinkAccount(username, userID, steamURL, dbconn).then(resp => {
				dlog('hit opLinkAccount then()');
				// console.log(resp);
				resolve(resp);
				return;
			}).catch(err => {
				log(err);
				resolve('An unforseen error has occurred, please contact `<@119966322523242497>` immediately and try again later. `[CODE: K75]`');
				return;
			});
		});
	}

	setUsername(userID, username) {
		const dbconn = this.dbc.conn();
		return new Promise(function(resolve) {
			opSetUsername(userID, username, dbconn).then(resp => {
				dlog('hit opSetUsername then()');
				// console.log(resp);
				resolve(resp);
				return;
			}).catch(err => {
				log(err);
				resolve('An unforseen error has occurred, please contact `<@119966322523242497>` immediately and try again later. `[CODE: K83]`');
				return;
			});
		});
	}

	avatarAssoc(userID, avatarURL) {
		dlog('hit opAvatarAssoc()');
		opAvatarAssoc(userID, avatarURL, this.dbc.conn(), this.cache.conn());
	}

	getUserSteamID(userID) {
		opGetUserSteamID(userID, this.dbc.conn()).then(sid => {
			return sid;
		});
	}

	getUserName(userID) {
		opGetUserName(userID, this.dbc.conn()).then(username => {
			return username;
		});
	}
}

module.exports = User;