// kiwi/relva/modules/user.js - Created February 6th, 2018

// Custom Modules
const log = require('./util/log.js');

// Operation Modules
const opAvatarAssoc = require('./ops/avatarAssoc.js');
const opCheckLinked = require('./ops/checkLinked.js');
const opLinkAccount = require('./ops/linkAccount.js');
const opSetUsername = require('./ops/setUsername.js');

// Data Operation Modules
const opGetUserSteamID = require('./ops/data/getUserSteamID.js');

class User {
    constructor(bot, dbOptions, cacheOptions) {
        this.bot = bot;
        this.dbc = new(require('./service/dbc.js'))(dbOptions);
        this.cache = new(require('./service/cache.js'))(cacheOptions);
        this.debug = process.env.DEBUG;
    }

    checkLinked(userID) {
        return opCheckLinked(userID, this.dbc.conn(), this.debug);
    }

    linkAccount(username, userID, steamURL) {
        let dbconn = this.dbc.conn();
        let debug = this.debug;
        return new Promise(function(resolve, reject) {
            opLinkAccount(username, userID, steamURL, dbconn, debug).then(resp => {
                //console.log('hit opLinkAccount then()');
                //console.log(resp);
                resolve(resp);
                return;
            }).catch(err => {
                resolve(`An unforseen error has occurred, please contact \`@drop#5904\` immediately and try again later. \`[CODE: K75]\``);
                return;
            });
        });
    }

    setUsername(userID, username) {
        let dbconn = this.dbc.conn();
        let debug = this.debug;
        let bot = this.bot;
        return new Promise(function(resolve, reject) {
            opSetUsername(userID, username, bot, dbconn, debug).then(resp => {
                //console.log('hit opSetUsername then()');
                //console.log(resp);
                resolve(resp);
                return;
            }).catch(err => {
                resolve(`An unforseen error has occurred, please contact \`@drop#5904\` immediately and try again later. \`[CODE: K83]\``);
                return;
            });
        });
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

    getUserName(userID) {
        opGetUserSteamID(userID, this.dbc.conn(), this.debug).then(sid => {
            return sid;
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