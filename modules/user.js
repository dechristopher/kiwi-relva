// kiwi/relva/modules/user.js - Created February 6th, 2018

// Custom Modules
const log = require('./util/log.js');

// Operation Modules
const opAvatarAssoc = require('./ops/avatarAssoc.js');
const opCheckLinked = require('./ops/checkLinked.js');

class User {
    constructor(bot, dbOptions, cacheOptions, debug = false) {
        this.bot = bot;
        this.dbc = new(require('./service/dbc.js'))(dbOptions);
        this.cache = new(require('./service/cache.js'))(cacheOptions);
        this.debug = debug;
    }

    checkLinked(userID) {
        return opCheckLinked(userID, this.dbc.conn(), this.debug);
    }

    linkAccount(userID, steamID) {
        return `[FAKE] Linked SteamID: ${steamID} to user ID: ${userID}`;
    }

    avatarAssoc(userID, avatarURL) {
        opAvatarAssoc(userID, avatarURL, this.dbc.conn(), this.cache.conn(), this.debug);
    }

    getUserSteamID(userID) {
        this.dbc.conn().query('SELECT steam_id FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            return results[0].steam_id;
        });
    }

    getUserSteamID64(userID) {
        this.dbc.conn().query('SELECT steam_id_64 FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            return results[0].steam_id_64;
        });
    }

    getUserSteamID3(userID) {
        this.dbc.conn().query('SELECT steam_id_3 FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            return results[0].steam_id_3;
        });
    }

    getUserSteamProfile(userID) {
        this.dbc.conn().query('SELECT steam_profile_url FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            return results[0].steam_profile_url;
        });
    }

    getUserDiscordAvatar(userID) {
        this.dbc.conn().query('SELECT discord_avatar_url FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            return results[0].discord_avatar_url;
        });
    }

}

module.exports = User;