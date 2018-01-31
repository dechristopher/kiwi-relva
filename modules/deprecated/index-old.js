// // NPM modules
// // "discord.io": "github:woor/discord.io#gateway_v6",
// const Discord = require('discord.io');

// // Core Node Modules
// const fs = require('fs');

// // Custom modules
// const ascii = require('./modules/ascii.js');
// const log = require('./modules/log.js');

// // Build configuration
// const conf = JSON.parse(fs.readFileSync('./config.json'));
// const version = require('./package').version;

// // Static strings
// const strBotUp = `Init KIWIBot [relva build v${version}]`;

// // Message reply strings
// const strMsgPing = `Pong!`;

// // Initialize bot
// var bot = new Discord.Client({
//     token: conf.token,
//     autorun: true
// });

// // Called when bot is connected
// bot.on('ready', function(evt) {
//     log(`Logged in as: ${bot.username} - (${bot.id})`);
// });

// // Called when bot receives messages
// bot.on('message', function(user, userID, channelID, message, evt) {
//     // Make sure the bot doesn't reply to its own messages
//     if (userID == bot.id) {
//         return;
//     }

//     // Our bot needs to know if it will execute a command
//     // It will listen for messages that will start with `!`
//     if (message.substring(0, 1) == '!') {
//         var args = message.substring(1).split(' ');
//         var cmd = args[0];

//         args = args.splice(1);
//         switch (cmd) {
//             // !ping
//             case 'ping':
//                 bot.sendMessage({
//                     to: channelID,
//                     message: strMsgPing
//                 });
//                 break;
//                 // !help
//             case 'help':
//                 bot.sendMessage({
//                     to: channelID,
//                     message: 'Pong!'
//                 });
//                 break;
//         }
//     } else {
//         // Otherwise it yells at the offending user
//         bot.sendMessage({
//             to: channelID,
//             message: 'Hey ' + user + ', the only language I understand is command-ese. Use !help to learn more.'
//         });
//     }
// });

// ascii();
// log(strBotUp);