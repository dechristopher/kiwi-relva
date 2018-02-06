// kiwi/relva/index.js - Created on January 30th, 2018

// NPM modules
const Discord = require('discord.js');

// Core Node Modules
const fs = require('fs');
const os = require('os');

// Custom modules
const ascii = require('./modules/util/ascii.js');
const log = require('./modules/util/log.js');
const help = require('./modules/help.js');
let user;

// Build configuration
const conf = JSON.parse(fs.readFileSync('./config.json'));
const priv = JSON.parse(fs.readFileSync('./priv.json'));
const version = require('./package').version;

// Static strings
const strBotUp = `Init KIWIBot [relva build v${version}]`;
const strForceShutdown = `Could not close connections in time, forcefully shutting down!`;
const strInitShutdown = `Init service shutdown`;
const strLogSeparator = `${os.EOL}~~~${os.EOL}`;

// Message reply strings
const strMsgPing = `Pong!`;
const strMsgNoDM = `I don't reply to DMs, please send me commands through the #kiwipugs channel in the KIWI Discord server.`;
const strMsgNotLinked = `Please link your SteamID with \`!link <Steam Profile URL>\` before continuing to use the service.`;
const strMsgHelp = `Available commands: \`!ping\`, \`!(q)ueue\`, \`!(p)arty\`, \`!(a)bout\`, \`!(h)elp\` - for command details type \`!help <command>\``;
const strMsgAbout = `I'm KIWI bot! Use me like your sick puppet and bend me to your will to use the KIWI PUG service.`;

// Initialize bot
// Discord.Client => https://discord.js.org/#/docs/main/stable/class/Client
let bot = new Discord.Client();

// The discord server the bot is a part of
let guild;

// Called when bot is connected
bot.on('ready', function() {
    log(`Logged in as: ${bot.user.username} => (${bot.user.id})`);
    // Instantiate the user module
    user = new(require('./modules/user.js'))(bot, conf.db);
    // Set the guild reference
    guild = bot.guilds.first();
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
    if (message.channel.id != conf.server.channel) {
        reply(strMsgNoDM);
        return;
    }

    // Perform avatar association transaction
    // log(message.author.avatarURL);
    // user.avatarAssoc(message.author.id, message.author.avatarURL);

    // Listen for messages that start with `!`
    if (message.content.substring(0, 1) == '!') {
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);

        let priv = checkYourPrivilege(message.author.id);

        // Ensure user has a linked steam account
        if (user.isLinked()) {
            switch (cmd) {
                case 'ping':
                    reply(strMsgPing);
                    break;

                case 'h':
                case 'help':
                    reply((args.length > 0) ? help(args) : strMsgHelp);
                    break;

                case 'a':
                case 'about':
                    reply(strMsgAbout);
                    break;

                case 'link':
                    reply(user.linkAccount(message.author.id, args[0]));
                    break;

                case 'q':
                case 'queue':
                    reply(queue(message.author.id));
                    break;

                case 'p':
                case 'party':
                    // Party operations
                    reply(party(args));
                    break;

                default:
                    reply(`\`!${cmd}\` isn't a valid command. Use !help to learn more.`);
                    break;
            }
        } else {
            if (cmd === 'link') {
                reply(user.linkAccount(message.author.id, args[0]));
            } else {
                reply(strMsgNotLinked);
                return;
            }
        }
    }
});

// Checks for and returns a user's privilege level
// 2 - admin
// 1 - mod
// 0 - normal
function checkYourPrivilege(userID) {
    for (let i = 0; i < priv.users.length; i++) {
        if (priv.users[i].userID == userID) {
            return users[i].level;
        }
    }
    return 0;
}

// Toggle player or party queue status
// Additionally runs checks to see if enqueued
// entities satisfy match being ptovisioned
//
// Returns status message for user information
function queue(userID) {
    //TODO: Add to queue
    //Check queue
    parseQueue();
    // Return response
    return `User ${userID} cannot be queued up since the PUG queue isn't online yet!`;
}

// Determines viability of fair game with
// active queued players and parties
function parseQueue() {

}

// Allows the user to operate on their currently
// joined party or to join or create a different one
//
// Returns status message for user information
function party(args) {
    return `Parties arent available yet, sorry boio.`;
}

// Creates a match and provisions a server in
// the selected region with the specified players
function provisionMatch(params = { players: ['drop', 'sparks'], region: 'us-ma' }) {

}

// Creates match room with specified matchID and
// returns channel object to the calling function
function createMatchRoom(matchID) {
    guild.createChannel(`matchroom-pug-${matchID}`, 'text').then((channel) => {
        channel.setParent(conf.matchRoomCategory);
        log(`Created matchroom ${channel.name};`);
        return channel;
    });
}

// Sends DMs to players selected for a new match
// Also adds them to the created match room
function provisionClients(players = ['drop', 'sparks']) {

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