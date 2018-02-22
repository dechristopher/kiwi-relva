// kiwi/relva/modules/ops/checkLinked.js - Created February 6th, 2018

// Custom Modules
const log = require('../util/log.js');

/**
 * Account link and username set checker
 * @param {string} userID the user's Discord ID
 * @param {Object} dbconn reference to the database connection
 * @param {boolean} debug debug mode
 * @returns {Promise<boolean>} whether or not the user has a Steam account linked and username set
 */
module.exports = function(userID, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        // Ensure user has a profile linked and has set their username
        dbconn.query("SELECT steam_id FROM `users` WHERE `discord_id` = ? AND `username` > ''", [userID], function(error, results, fields) {
            //if (debug) { log(`${userID} ${results} ${results[0].steam_id !== undefined}`); }
            if (error) {
                log('checkLinked Error: ' + error);
                resolve(`Sorry, something weird happened on our end. Contact \`<@119966322523242497>\` immediately and try again shortly. \`[CODE: K68]\``);
                return;
            }
            resolve((results.length === 1) ? true : false);
        });
    });
};