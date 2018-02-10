// kiwi/relva/modules/ops/avatarAssoc.js - Created February 6th, 2018

// Custom Modules
const log = require('../util/log.js');

/*
    Avatar Association Algorithm: doc/avatar-association-algorithm.txt
    - Non-promisified, happens regardles of command runner event loop
    - userID (string): the user's Discord ID
    - dbconn (Object): reference to the database connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(userID, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        dbconn.query('SELECT steam_id FROM `users` WHERE `discord_id` = ?', [userID], function(error, results, fields) {
            //if (debug) { log(`${userID} ${results} ${results[0].steam_id !== undefined}`); }
            if (error) {
                reject(error);
            }
            resolve((results.length === 1) ? true : false);
        });
    });
};