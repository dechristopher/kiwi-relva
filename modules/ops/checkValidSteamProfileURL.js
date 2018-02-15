// kiwi/relva/modules/ops/checkValidSteamProfileURL.js - Created February 14th, 2018

// NPM Modules
const regex = require('regex');

// Custom Modules
const log = require('../util/log.js');

/*
    SteamProfile URL formatter
    - steamURL (string): the Steam profile URL to check
*/
module.exports = function(steamURL) {
    // Steam Profile URL Regex
    let steamURLReg = new RegExp(`(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+`);
    // Run checks
    return new Promise(function(resolve, reject) {
        // Ensure the given Steam Profile URL is valid
        if (steamURLReg.test(steamURL)) {
            //console.log('bad steam profile URL')
            resolve(true);
            return;
        }
        resolve(false);
    });
};