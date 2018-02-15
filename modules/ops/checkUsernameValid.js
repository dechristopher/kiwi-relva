// kiwi/relva/modules/ops/checkLinkedNoUsername.js - Created February 15th, 2018

// Custom Modules
const log = require('../util/log.js');

/*
    Account link checker (no username set)
    - userID (string): the user's Discord ID
    - dbconn (Object): reference to the database connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(username) {
    return new Promise(function(resolve, reject) {
        // Ensure user has provided a valid username
        // alpha-numerics, underscores, and dashes only
        // more than two characters
        let usernameRegex = /^[a-zA-Z0-9-_]+$/;
        resolve((usernameRegex.test(username)) && (username.length >= 2));
    });
};