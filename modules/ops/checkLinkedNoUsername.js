// kiwi/relva/modules/ops/checkLinkedNoUsername.js - Created February 15th, 2018

// Custom Modules
const log = require('../util/log.js');

/*
    Account link checker (no username set)
    - userID (string): the user's Discord ID
    - dbconn (Object): reference to the database connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(userID, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        // Ensure user has a profile linked and has not set their username yet
        dbconn.query("SELECT steam_id FROM `users` WHERE `discord_id` = ?", [userID], function(error, results, fields) {
            //if (debug) { log(`${userID} ${results} ${results[0].steam_id !== undefined}`); }
            if (error) {
                log(error);
                resolve(`Sorry, something weird happened on our end. Contact \`<@119966322523242497>\` immediately and try again shortly. \`[CODE: K68.5]\``);
                return;
            }
            resolve((results.length === 1) ? true : false);
        });
    });
};