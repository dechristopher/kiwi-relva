// kiwi/relva/modules/help.js - Created February 5th, 2018

// Command help descriptions
const strHelpPing = `\`!ping\`: basic response command to test bot functionality and response time.`;
const strHelpHelp = `\`!help\`: gives more information about certain commands and their usage.`;
const strHelpAbout = `\`!about\`: gives some basic information about the KIWI PUG system and KIWIBot.`;
const strHelpQueue = `\`!queue\`: allows a user or party to join the PUG or scrim matchmaking queue`;
const strHelpParty = `\`!party\`: allows users to create parties to queue into matches together.`;

module.exports = function(args) {
    // Returns help strings for questioned commands
    let reply;
    switch (args[0]) {
        case 'ping':
            reply = strHelpPing;
            break;

        case 'h':
        case 'help':
            reply = strHelpHelp;
            break;

        case 'a':
        case 'about':
            reply = strHelpAbout;
            break;

        case 'q':
        case 'queue':
            reply = strHelpQueue;
            break;

        case 'p':
        case 'party':
            reply = strHelpParty;
            break;

        default:
            reply = `\`!${args}\` is not a valid command. Use !help to learn more.`;
            break;
    }
    return reply;
}