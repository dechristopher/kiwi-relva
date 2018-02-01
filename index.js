// kiwi/relva/index.js - Created on January 30th, 2018

// NPM modules
const Discord = require('discord.js');

// Core Node Modules
const fs = require('fs');
const os = require('os');

// Custom modules
const ascii = require('./modules/ascii.js');
const log = require('./modules/log.js');

// Build configuration
const conf = JSON.parse(fs.readFileSync('./config.json'));
const version = require('./package').version;

// Static strings
const strBotUp = `Init KIWIBot [relva build v${version}]`;
const strForceShutdown = `Could not close connections in time, forcefully shutting down!`;
const strInitShutdown = `Init service shutdown`;
const strLogSeparator = `${os.EOL}~~~${os.EOL}`;

// Message reply strings
const strMsgPing = `Pong!`;
const strMsgNoDM = `I don't reply to DMs, please send me commands through the #kiwipugs channel in the KIWI Discord server.`;
const strMsgHelp = `Available commands: \`!ping\`, \`!help\`, \`!about\`, \`!queue\` - for command details type \`!help <command>\``;
const strMsgAbout = `I'm KIWI bot! Use me like your sick puppet and bend me to your will to use the KIWI PUG service.`;

// Initialize bot
// Discord.Client => https://discord.js.org/#/docs/main/stable/class/Client
var bot = new Discord.Client();

// Called when bot is connected
bot.on('ready', function() {
    log(`Logged in as: ${bot.user.username} => (${bot.user.id})`);
});

// Called when bot receives messages
// message => https://discord.js.org/#/docs/main/stable/class/Message
bot.on('message', message => {
    // Make sure the bot doesn't reply to its own messages
    if (message.author.id == bot.user.id) {
        return;
    }

    // Wrapper for sending messages, just to be concise
    const reply = (content) => {
        message.channel.send(content);
    };

    // Only reply to messages in #kiwipugs
    if (message.channel.id != conf.channel) {
        reply(strMsgNoDM);
        return;
    }

    // Listen for messages that start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        switch (cmd) {
            case 'ping':
                reply(strMsgPing);
                break;

            case 'help':
                reply(strMsgHelp);
                break;

            case 'about':
                reply(strMsgAbout);
                break;

            case 'q':
            case 'queue':
                queue(message.author.id);
                break;

            case 'p':
            case 'party':
                // Party operations
                break;

            default:
                reply(`\`!${cmd}\` isn't a valid command. Use !help to learn more.`);
                break;
        }
    } else {
        // Otherwise it yells at the offending user (but we don't need this if we're not supporting DMs)
        // reply(`Hey ${message.author.username}, the only language I understand is command-ese. Use !help to learn more.`);
    }
});

// Toggle player or party queue status
// Additionally runs checks to see if enqueued
// entities satisfy match being ptovisioned
function queue(userID) {

}

// Determines viability of fair game with
// active queued players and parties
function parseQueue() {

}

// Creates a match and provisions a server in
// the selected region with the specified players
function provisionMatch(params = { players: ['drop', 'sparks'], region: 'us-ma' }) {

}

// Sends DMs to players selected for a new match
function notifyClients(players = ['drop', 'sparks']) {

}

// Initiate shutdown procedures
function terminate() {
    // Hard quit if service cannot gracefully shutdown after 10 seconds
    setTimeout(function() {
        log(strForceShutdown, { newLinePre: true }).then(() => {
            log(strLogSeparator, { stdOut: false, usePrefix: false }).then(() => {
                // Terminate with exit code 1
                process.exit(1);
            });
        });
    }, 10 * 1000);
    // Attempt a graceful shutdown on SIGTERM
    bot.destroy().then(() => {
        log(strInitShutdown, { newLinePre: true }).then(() => {
            log(strLogSeparator, { stdOut: false, usePrefix: false }).then(() => {
                // Close db, rcon connections, and etc...
                // Terminate with exit code 0
                process.exit(0);
            });
        });
    });
}

// Catch the termination signal and operate on it
process.on('SIGTERM', function() {
    terminate();
});

// Catch the interrupt signal and operate on it
process.on('SIGINT', function() {
    terminate();
});

// Authenticate using the bot token
bot.login(conf.token);

ascii(); // Startup messages
log(strBotUp);