// kiwi/relva/modules/ops/avatarAssoc.js - Created February 6th, 2018

// Custom Modules
const dlog = require('../util/log.js');

/*
    Avatar Association Algorithm: doc/avatar-association-algorithm.txt
    - Non-promisified, happens regardles of command runner event loop
    - userID (string): the user's Discord ID
    - avatarURL (string): link to the user's Discord avatar
    - dbconn (Object): reference to the database connection
    - cconn (Object): reference to the cache connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(userID, avatarURL, dbconn, cconn, debug) {
    // Check to see if the cache contains an entry for the user's avatar
    cconn.hexists('avatars', userID, function(err, reply) {
        dlog(`Avatar Exists (${userID}): ${reply}`);
        if (reply === 1) {
            // Get the avatar URL from the cache to check if it's the same
            cconn.hget('avatars', userID, function(err, reply) {
                if (reply === avatarURL) {
                    // Do nothing :D
                    dlog(`Avatar for ${userID} already set properly. Not hitting db.`);
                    return;
                } else {
                    // Update the changed avatar in the database
                    dbconn.query('UPDATE `users` SET `discord_avatar_url` = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error, results, fields) {
                        dlog(`Set ${userID} avatar to ${avatarURL} in db`);
                    });
                    // Update the changed avatar in the cache
                    cconn.hset('avatars', userID, avatarURL, function(err, reply) {
                        dlog(`Set ${userID} avatar to ${avatarURL} in cache`);
                    });
                }
            });
        } else {
            // Set the avatar in the database
            dbconn.query('UPDATE `users` SET `discord_avatar_url` = ? WHERE `discord_id` = ?', [avatarURL, userID], function(error, results, fields) {
                dlog(`Set ${userID} avatar to ${avatarURL} in db`);
            });
            // Set the avatar in the cache
            cconn.hset('avatars', userID, avatarURL, function(err, reply) {
                dlog(`Set ${userID} avatar to ${avatarURL} in cache`);
            });
        }
    });
};