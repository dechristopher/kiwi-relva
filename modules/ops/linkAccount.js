// kiwi/relva/modules/ops/linkAccount.js - Created February 6th, 2018

// Custom Modules
const log = require('../util/log.js');
const opGrabSteamID = require('./grabSteamID.js');
const grabCSGOHours = require('./grabCSGOHours.js');
const formatSteamURL = require('./formatSteamURL.js');
const checkValidSteamProfileURL = require('./checkValidSteamProfileURL.js');

/*
    Account Linker
    - userID (string): the user's Discord ID
    - steamURL (string): the user's steam profile URL
    - dbconn (Object): reference to the database connection
    - debug (boolean): whether or not to show debug output
*/
module.exports = function(username, userID, steamProfURL, dbconn, debug) {
    return new Promise(function(resolve, reject) {
        //console.log('hit linkAccount start');
        if (steamProfURL === undefined || steamProfURL === '') {
            //console.log('undefined steamID');
            resolve(`Please provide a steam profile URL after the command like so: \`!link <steam profile URL>\``);
            return;
        }


        checkValidSteamProfileURL(steamProfURL).then(valid => {
            if (!valid) {
                resolve(`Invalid Steam Profile URL`);
                return;
            }
            // Format Steam Profile URL
            formatSteamURL(steamProfURL).then(steamURL => {
                // Grab the steamIDs of the profile
                opGrabSteamID(steamURL).then(nugget => {
                    //console.log('hit opGrabSteamID start');
                    if (nugget.error !== undefined) {
                        //console.log('opGrabSteamID error');
                        resolve(nugget.error);
                        return;
                    }
                    //console.dir(nugget);
                    //console.log('! -> ' + nugget.ids.steamid);
                    // Pull the number of hours in CS:GO the player has
                    grabCSGOHours(nugget.ids.steamid).then(hours => {
                        if (hours === -1) {
                            resolve(`You don't seem to own CS:GO. Please link a steam account that owns CS:GO and has at least 500 hours ingame to play on KIWI.`);
                            return;
                        } else if (hours < 500) {
                            hoursLeft = 500 - hours;
                            if (hoursLeft === 1) {
                                resolve(`You must have played at least 500 hours of CS:GO to play on KIWI. You have ${hours} hours. Play 1 more hour to qualify!`);
                                return;
                            } else {
                                resolve(`You must have played at least 500 hours of CS:GO to play on KIWI. You have ${hours} hours. Play ${hoursMore} more hours to qualify!`);
                                return;
                            }
                        }

                resolve('linked');
                return;
            });

            // resolve(`Hey `\${username}`\, this Steam Profile looks like it's already being used by someone else. Check it again and contact \`drop\` if you're having trouble.`);
            // resolve(`Hey `\${username}`\, I linked your Steam Profile successfully! Now just set your username using \`!name <username>\` and you'll be all set.`);

            // Check to see if steamID is already associated with an account
            //  - Error out if exists
            //  - Else add info to DB
            //      - Then send back prompt to the user to set their username
        });
    });
};