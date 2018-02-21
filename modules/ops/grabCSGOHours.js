// kiwi/relva/modules/ops/grabSteamID.js - Created February 6th, 2018

// NPM Modules
const got = require('got');

// Custom Modules
const dlog = require('../util/dlog.js');

/*
    CS:GO Hours Grabber
    - steamID (string): the Steam ID of the user in question

    Returns: (number): hours(rounded)
    Returns: -1 if account doesn't own CS:GO
*/
module.exports = function(steamID) {
    return new Promise(function(resolve, reject) {
        // Snag some info from random API we found to get hours
        got(`https://beta.decapi.me/steam/hours?id=${steamID}&appid=730`).then(resp => {
            if (resp.body.split(' ').indexOf('game') > -1) {
                resolve(-1);
            }
            let hours = parseInt(resp.body.split(' ')[0]);
            dlog(`[HOURS] ${steamID} -> ${hours} hours`);
            resolve(hours);
        });
    });
};