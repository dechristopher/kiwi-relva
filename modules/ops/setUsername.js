// kiwi/relva/modules/ops/setUsername.js - Created February 13th, 2018

// Custom Modules
const log = require('../util/log.js');
const checkLinkedNoUsername = require('./checkLinkedNoUsername.js');
const checkUsernameValid = require('./checkUsernameValid.js');

/**
 * Username setter
 * @param {string} userID the Discord user ID of the user
 * @param {string} username the user's desired KIWI username
 * @param {Object} dbconn reference to the database connection
 * @param {boolean} debug debug mode
 * @returns {Promise<string>} response to user with result on resolve
 */
module.exports = function(userID, username, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        // Ensure user has linked steam profile to discord user FIRST
        // - Error out if not
        // - Else run checks on username validity
        //      - If username invalid, error out
        //      - Else check to see if username already taken
        //          - If username taken, error out
        //          - Else set username in DB and then set user role to 'PUG User'
        checkLinkedNoUsername(userID, dbconn, debug).then(linked => {
            if (!linked) {
                resolve(`You have to link your SteamID with \`!link <Steam Profile URL>\` before setting your username.`);
                return;
            } else {
                checkUsernameValid(username).then(valid => {
                    if (!valid) {
                        resolve(`Your desired username must only contain \`letters\`, \`numbers\`, \`dashes\`, and \`underscores\` and must be \`two or more characters long\`.`);
                    } else {
                        dbconn.query("SELECT steam_id FROM `users` WHERE `username` = ?", [username], function(error, results, fields) {
                            if (error) {
                                log('setUsername Error [0]: ' + error);
                                resolve(`Sorry, something weird happened on our end. Contact \`<@119966322523242497>\` immediately and try again shortly. \`[CODE: K91]\``);
                                return;
                            }
                            if (results.length === 1) {
                                resolve(`The username \`${username}\` is already taken. Try another.`);
                            } else {
                                dbconn.query("UPDATE `users` SET `username` = ? WHERE `discord_id` = ?", [username, userID], function(error, results, fields) {
                                    if (error) {
                                        log('setUsername Error [1]: ' + error);
                                        resolve(`Sorry, something weird happened on our end. Contact \`<@119966322523242497>\` immediately and try again shortly. \`[CODE: K92]\``);
                                        return;
                                    }
                                    resolve(`Username set successfully to \`${username}\`, you'll be removed from this channel shortly and added into the #kiwipugs channel. Use \`!help\` to learn how to use the PUG system. Have fun!`);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};