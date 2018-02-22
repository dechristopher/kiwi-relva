// kiwi/relva/modules/ops/formatSteamURL.js - Created February 14th, 2018

// Custom Modules
const log = require('../util/log.js');

/**
 * SteamProfile URL formatter
 * @param {string} steamURL the Steam profile URL to format
 * @returns {Promise<string>} formatted Steam profile URL
 */
module.exports = function(steamURL) {
    const stripWWW = function(steamURL) {
        return new Promise(function(resolve, reject) {
            // Strip www. from URL (because it breaks everything)
            if (steamURL.includes('www.')) {
                //console.log('has www.');
                steamURL = steamURL.replace('www.', '');
                resolve(steamURL);
                return;
            }
            resolve(steamURL);
        });
    };

    const replaceHTTP = function(steamURL) {
        return new Promise(function(resolve, reject) {
            // Add https:// if URL doesn't contain it
            if (steamURL.includes('http://')) {
                //console.log('has replace http with https');
                steamURL = steamURL.replace('http://', 'https://');
                resolve(steamURL);
                return;
            }
            resolve(steamURL);
        });
    }

    const addHTTPS = function(steamURL) {
        return new Promise(function(resolve, reject) {
            // Add https:// if URL doesn't contain it
            if (!steamURL.includes('https://') && !steamURL.includes('http://')) {
                //console.log('has www.');
                steamURL = 'https://' + steamURL;
                resolve(steamURL);
                return;
            }
            resolve(steamURL);
        });
    };

    // Run formatting
    return new Promise(function(resolve, reject) {
        stripWWW(steamURL).then(url => {
            replaceHTTP(url).then(url => {
                addHTTPS(url).then(url => {
                    resolve(url);
                });
            });
        });
    });
};