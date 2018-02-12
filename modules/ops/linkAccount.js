// kiwi/relva/modules/ops/linkAccount.js - Created February 6th, 2018

// Custom Modules
const log = require('../util/log.js');
const opGrabSteamID = require('./grabSteamID.js');

/*
    Account Linker
    - userID (string): the user's Discord ID
    - steamURL (string): the user's steam profile URL
    - dbconn (Object): reference to the database connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(username, userID, steamURL, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        opGrabSteamID(steamURL).then(nugget => {
            if (nugget.error !== undefined) {
                resolve(nugget.error);
            }

            // resolve(`Hey `\${username}`\, this Steam Profile looks like it's already being used by someone else. Check it again and contact \`drop\` if you're having trouble.`);
            // resolve(`Hey `\${username}`\, I linked your Steam Profile successfully! Now just set your username using \`!name <username>\` and you'll be all set.`);

            // Check to see if steamID is already associated with an account
            //  - Error out if exists
            //  - Else add info to DB
            //      - Then send back prompt to the user to set their username
        });
    });
};