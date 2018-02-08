// kiwi/relva/modules/user.js - Created February 6th, 2018

// Custom Modules
const log = require('./util/log.js');

class User {
    constructor(bot, dbOptions, cacheOptions, debug = false) {
        this.bot = bot;
        this.dbc = new(require('./service/dbc.js'))(dbOptions);
        this.cache = new(require('./service/cache.js'))(cacheOptions);
        this.debug = debug;
    }

    checkLinked(userID) {
        let conn = this.dbc.conn();
        return new Promise(function(resolve, reject) {
            conn.query('SELECT steam_id FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
                if (error) {
                    reject(error);
                }
                //console.log(`${userID} ${results} ${results[0].steam_id !== undefined}`);
                if (results.length === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    linkAccount(userID, steamID) {
        return `[FAKE] Linked SteamID: ${steamID} to user ID: ${userID}`;
    }

    // Non-promisified, happens regardles of command running chain
    avatarAssoc(userID, avatarURL) {
        let dbconn = this.dbc.conn();
        let cconn = this.cache.conn();
        let debug = this.debug;
        cconn.hexists('avatars', userID, function(err, reply) {
            if (debug) { log(`Avatar Exists (${userID}): ${reply}`); }
            if (reply === 1) {
                cconn.hget('avatars', userID, function(err, reply) {
                    if (reply === avatarURL) {
                        // Do nothing :D
                        if (debug) { log(`Avatar for ${userID} already set properly. Not hitting db.`); }
                        return;
                    } else {
                        dbconn.query('UPDATE `users` SET discord_avatar_url = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error, results, fields) {
                            if (debug) { log(`Set ${userID} avatar to ${avatarURL} in db`); }
                        });
                        cconn.hset('avatars', userID, avatarURL, function(err, reply) {
                            if (debug) { log(`Set ${userID} avatar to ${avatarURL} in cache`); }
                        });
                    }
                });
            } else {
                dbconn.query('UPDATE `users` SET discord_avatar_url = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error, results, fields) {
                    if (debug) { log(`Set ${userID} avatar to ${avatarURL} in db`); }
                });
                cconn.hset('avatars', userID, avatarURL, function(err, reply) {
                    if (debug) { log(`Set ${userID} avatar to ${avatarURL} in cache`); }
                });
            }
        });
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