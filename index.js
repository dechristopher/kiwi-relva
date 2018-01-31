// NPM modules
const Discord = require('discord.js');

// Core Node Modules
const fs = require('fs');

// Custom modules
const ascii = require('./modules/ascii.js');
const log = require('./modules/log.js');

// Build configuration
const conf = JSON.parse(fs.readFileSync('./config.json'));
const version = require('./package').version;

// Static strings
const strBotUp = `Init KIWIBot [relva build v${version}]`;

// Message reply strings
const strMsgPing = `Pong!`;
const strMsgInvalid = `That isn't a valid command. Use !help to learn more.`;

// Initialize bot
// Discord.Client => https://discord.js.org/#/docs/main/stable/class/Client
var bot = new Discord.Client();

// Called when bot is connected
bot.on('ready', function() {
    log(`Logged in as: ${bot.user.username} - (${bot.user.id})`);
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

    // Listen for messages that start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        switch (cmd) {
            // !ping
            case 'ping':
                reply(strMsgPing);
                break;
                // !help
            case 'help':
                reply(strMsgPing);
                break;
            default:
                reply(strMsgInvalid);
                break;
        }
    } else {
        // Otherwise it yells at the offending user
        reply(`Hey ${message.author.username}, the only language I understand is command-ese. Use !help to learn more.`);
    }
});

// Authenticate using the bot token
bot.login(conf.token);

ascii(); // Startup messages
log(strBotUp);