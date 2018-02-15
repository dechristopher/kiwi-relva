// kiwi/relva/modules/ops/grabSteamID.js - Created February 6th, 2018

// NPM Modules
const got = require('got');
const parser = require('xml2js').parseString;
const steam = require('steamidconvert')();

// Custom Modules
const log = require('../util/log.js');

/*
    Steam URL to SteamID parser
    - steamURL (string): the Steam Profile URL to get the Steam IDs of

    Returns: Object: nugget
    {
        error: (string [if any]): an error encountered
        ids: {
            steamid: STEAM_0:0:39990
            steamid64: 76561197960345708
            steamid3: [U:1:79980]
        }
    }
*/
module.exports = function(steamURL) {
    return new Promise(function(resolve, reject) {
        let nugget = {};
        // Snag some info from the XML API
        got(`${steamURL}?xml=1`).then(resp => {
            // Parse the XML as JSON
            parser(resp.body, (err, results) => {
                if (err) {
                    log(`[SID PARSE ERROR] ${steamURL} -> ${err}`);
                    nugget.error = `Failed to parse Steam Profile URL. Please try again later on after contacting \`drop\` immediately. [CODE: K76]`;
                    nugget.ids = {};
                    resolve(nugget);
                }
                nugget.error = undefined;
                // Convert the steamID64 into the other two formats
                nugget.ids = {
                    steamid: steam.convertToText(results.profile.steamID64[0]),
                    steamid64: results.profile.steamID64[0],
                    steamid3: steam.convertToNewFormat(steam.convertToText(results.profile.steamID64[0]))
                };
                resolve(nugget);
            });
        });
    });
};