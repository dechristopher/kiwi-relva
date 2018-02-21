// kiwi/relva/modules/ops/checkValidSteamProfileURL.js - Created February 14th, 2018

// NPM Modules
const regex = require('regex');

// Custom Modules
const dlog = require('../util/dlog.js');

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
        let result = steamURLReg.test(steamURL);
        dlog(`${steamURL} valid? ${result}`);
        resolve(result);
    });
};