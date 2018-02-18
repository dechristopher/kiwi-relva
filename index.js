// kiwi/relva/index.js - Created on January 30th, 2018

// NPM modules
const Discord = require('discord.js');
const Collection = require('discord.js').Collection;

// Core Node Modules
const fs = require('fs');
const os = require('os');

// Custom modules
const ascii = require('./modules/util/ascii.js');
const log = require('./modules/util/log.js');
const help = require('./modules/help.js');
const perms = require('./modules/perms.js');
let queue = new(require('./modules/queue.js'))();
let user;

// Custom Types
let Solo = require('./modules/types/Solo.js');
let Party = require('./modules/types/Party.js');

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
const strMsgNotLinked = `Please link your SteamID with \`!link <Steam Profile URL>\` and set your name with \`!name <username>\` before continuing to use the service.`;
const strMsgAlreadyLinked = `Your account is already linked properly. Use \`!help\` to learn more.`;
const strMsgHelp = `Available commands: \`!ping\`, \`!(q)ueue\`, \`!(p)arty\`, \`!(a)bout\`, \`!(h)elp\` - for command details type \`!help <command>\``;
const strMsgAbout = `I'm KIWI Bot! Use me like your sick puppet and bend me to your will to use the KIWI PUG service. Use \`!help\` to learn what I can do.`;

// Initialize bot
// Discord.Client => https://discord.js.org/#/docs/main/stable/class/Client
let bot = new Discord.Client();

// The discord server the bot is a part of { Guild }
let guild;

// Party Channel storage { Collection<string, GuildChannel> }
let partyChannels = new Collection();
// MatchRoom Channel storage { Collection<string, GuildChannel> }
let matchRoomChannels = new Collection();

// Base party channel to clone new party channels from { GuildChannel }
let basePartyChannel;
// Base matchRoom channel to clone new matchRoom channels from { GuildChannel }
let baseMatchRoomChannel;

// Debug mode enabled
if (process.argv.indexOf("debug") > -1) {
    process.env.DEBUG = true;
} else {
    process.env.DEBUG = false;
}
let debug = process.env.DEBUG;

// Called when bot is connected
bot.on('ready', function() {
    log(`Login: ${bot.user.username} => (${bot.user.id})`);
    // Instantiate the user module and service factories
    user = new(require('./modules/user.js'))(bot, conf.db, conf.cache);
    // Set the guild reference
    guild = bot.guilds.first();
    // Set the base party channel template
    basePartyChannel = guild.channels.get(conf.server.partyBaseID);
    // Set the base matchRoom channel template
    baseMatchRoomChannel = guild.channels.get(conf.server.matchRoomBaseID);
    queue.emit('queueInit', guild.id);
});

// Hit when queue is initialized
queue.on('queueInit', function(guildID) {
    log(`Queue Initialized: ${guildID}`);
});

// Hit when entity joins the queue
queue.on('queueJoin', function(entity) {

});

bot.on('warn', console.warn);
bot.on('error', console.error);
//bot.on('disconnect', log('DISCONNECTED'));
//bot.on('reconnecting', log('RECONNECTING'));

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

    // Only reply to messages in #kiwipugs and #kiwiverify
    if (message.channel.id != conf.server.pugChannel && message.channel.id != conf.server.verifyChannel) {
        reply(strMsgNoDM);
        return;
    }
    message.channel.startTyping();

    // Listen for messages that start with `!`
    if (message.content.substring(0, 1) == '!') {
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);

        // Get user privilege level
        let priv = checkYourPrivilege(message.author.id);

        user.checkLinked(message.author.id).then((isLinked) => {
            if (isLinked) {
                // Perform avatar association transaction
                user.avatarAssoc(message.author.id, message.author.avatarURL);

                //Run commands
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
                        reply(strMsgAlreadyLinked);
                        break;

                    case 'q':
                    case 'queue':
                        reply(enqueue(message.author.id));
                        break;

                    case 'p':
                    case 'party':
                        // Party operations
                        reply(party(args));
                        break;

                    case 'pi':
                        reply(`3.14159265359...`);
                        break;

                    case 'admin':
                        reply(`<@119966322523242497> will be able to help with whatever questions you may have.`);
                        break;

                    default:
                        reply(`\`!${cmd}\` isn't a valid command. Use !help to learn more.`);
                        break;
                }
            } else {
                // Check for link attempt
                if (cmd === 'link') {
                    user.linkAccount(message.author.username, message.author.id, args[0]).then(resp => {
                        reply(resp);
                    });
                } else if (cmd === 'name') {
                    user.setUsername(message.author.id, args[0]).then(resp => {
                        if (resp.includes("#kiwipugs")) {
                            setPUGRole(message.author);
                        }
                        reply(resp);
                    });
                } else {
                    reply(strMsgNotLinked);
                }
            }
        }).catch((err) => {
            log(err);
            reply(`Error! We're looking into it...`);
        });

        message.channel.stopTyping();
    }
});

/**
 * Checks for and returns a user's privilege level
 * @param {string} [id] the userID to check
 */

function checkYourPrivilege(id) {
    for (let i = 0; i < priv.users.length; i++) {
        if (priv.users[i].userID == userID) {
            return users[i].level;
        }
    }
    return 0;
}

/**
 * Gives the provided user the PUG Player role
 * @param {GuildMember} [user] the user to give the role to
 */
function setPUGRole(user) {
    setTimeout(function() {
        log(`Set PUG User -> ${user.username} (${user.id})`);
        guild.fetchMember(user).then(member => {
            member.addRole(conf.server.pugRole);
        });
    }, 5000);
}

/**
 * Toggle player or party queue status
 * @param {QueueEntity} [entity] the entity to queue
 * @returns {string} status message for user information
 */
function enqueue(entity) {
    //TODO: Add to queue
    //queue.emit('queueJoin', entity);
    // Return response
    return `You cannot be queued up since the PUG queue isn't online yet!`;
}

// Determines viability of fair game with
// active queued players and parties
function parseQueue() {
    // TODO
}

/**
 * Operate on the party the user is a part of
 * @param {GuildMember} [user] the user running the command
 * @param {string[]} [args] subcommands and parameters
 * @returns {string} command response text
 */
function party(user, args) {
    return `Parties arent available yet, sorry pal.`;
}

/**
 * Creates a match and provisions a server in the selected region with the specified players
 * @param {string} [region] the region to spawn the server in
 * @param {Collection<string, User>} players a list of players in the match
 */

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
function provisionClients(channel, players = ['drop', 'sparks']) {

}

/**
 * Inititates shutdown procedures
 * @returns nothing
 */
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
                user.dbc.conn().destroy();
                user.cache.conn().end();
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