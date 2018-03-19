// kiwi/relva/index.js - Created on January 30th, 2018

// NPM modules
const Discord = require('discord.js');
const Collection = require('discord.js').Collection;
const git = require('git-last-commit');

// Core Node Modules
const fs = require('fs');
const os = require('os');

// Custom modules
const ascii = require('./modules/util/ascii');
const log = require('./modules/util/log');
const dlog = require('./modules/util/dlog');
const priv = require('./modules/util/checkPriv');
const queue = new (require('./modules/queue'))();
let opUser;

// Custom Types
const Solo = require('./modules/types/Solo');
const Party = require('./modules/types/Party');

// Build configuration
const conf = JSON.parse(fs.readFileSync('./config.json'));
const version = require('./package').version;
let build;

// Static strings
let strBotUp;
const strForceShutdown = 'Could not close connections in time, forcefully shutting down!';
const strInitShutdown = 'Init service shutdown';
const strLogSeparator = `${os.EOL}~~~${os.EOL}`;

// Message reply strings
const strMsgNoDM = 'I don\'t reply to DMs, please send me commands through the #kiwipugs channel in the KIWI Discord server.';
const strMsgNotLinked = 'Please link your SteamID with `!link <Steam Profile URL>` and set your name with `!name <username>` before continuing to use the service.';

// Get latest build number
git.getLastCommit((err, commit) => {
	if (err) {
		build = 'NOGIT';
		return;
	}
	build = commit.shortHash;
	strBotUp = `Init KIWIBot [relva v${version} | build ${build}]`;
});

/**
 * Discord.Client => https://discord.js.org/#/docs/main/stable/class/Client
 * @type {Client}
 */
const bot = new Discord.Client();

/**
 * Command Collection
 * @type {Collection<string, CommandModule>}
 */
bot.commands = new Discord.Collection();

/**
 * Linking Command Collection
 * @type {Collection<string, CommandModule>}
 */
bot.commandsLink = new Discord.Collection();

/**
 * Command cooldowns collection
 * @type {Collection<string, >}
 */
const cooldowns = new Discord.Collection();

/**
 * The discord server the bot is a part of
 * @type {Guild}
 */
let guild;

/**
 * The #kiwipugs channel
 * @type {GuildChannel}
 */
let pugChannel;

/**
 * Party Channel Collection
 * @type {Collection<string, GuildChannel>}
 */
const partyChannels = new Collection();
/**
 * MatchRoom Channel Collection
 * @type {Collection<string, GuildChannel>}
 */
const matchRoomChannels = new Collection();

/**
 * Base party channel to clone new party channels from
 * @type {GuildChannel}
 */
let basePartyChannel;
/**
 * Base matchroom channel to clone new party channels from
 * @type {GuildChannel}
 */
let baseMatchRoomChannel;

/**
 * Build command modules and add to commands collection
 * @returns {Promise<string>} message with number of modules loaded
 */
const buildCommands = async () => {
	const commandFiles = fs.readdirSync('./commands');
	for (const file of commandFiles) {
		// Exclude linking directory to avoid require errors
		if(file !== 'linking') {
			const command = require(`./commands/${file}`);
			bot.commands.set(command.name, command);
		}
	}
	return `Loaded ${bot.commands.size} regular commands`;
};

/**
 * Build link command modules and add to commands collection
 * @returns {Promise<string>} message with number of modules loaded
 */
const buildLinkCommands = async () => {
	const commandFiles = fs.readdirSync('./commands/linking');
	for (const file of commandFiles) {
		const command = require(`./commands/linking/${file}`);
		bot.commandsLink.set(command.name, command);
	}
	return `Loaded ${bot.commandsLink.size} linking commands`;
};

const buildUserModule = function() {
	return new Promise(function(resolve) {
		opUser = new (require('./modules/user.js'))(bot, conf.db, conf.cache);
		// Export opUser module
		exports.opUser = opUser;
		resolve();
	});
};

// Called when bot is connected
bot.on('ready', function() {
	log(`Login: ${bot.user.username} => (${bot.user.id})`);
	// Set the activity state of the bot
	bot.user.setActivity('KIWI PUGs', { type: 'WATCHING' });
	// Set the guild reference
	guild = bot.guilds.first();
	// Export guild object
	exports.guild = guild;
	// Instantiate the user module and service factories
	buildUserModule().then(() => {
		// Load command modules
		buildCommands().then(log);
		// Load link command modules
		buildLinkCommands().then(log);
	});
	pugChannel = guild.channels.get(conf.server.pugChannel);
	// Set the base party channel template
	basePartyChannel = guild.channels.get(conf.server.partyBaseID);
	// Set the base matchRoom channel template
	baseMatchRoomChannel = guild.channels.get(conf.server.matchRoomBaseID);
	// Initialize the queue
	queue.emit('queueInit', guild.id);
});

// Hit when queue is initialized
queue.on('queueInit', function(guildID) {
	log(`Queue Initialized: ${guildID}`);
});

// Hit when entity joins the queue
queue.on('queueJoin', function(entity) {
	dlog(entity);
});

bot.on('warn', console.warn);
bot.on('error', console.error);
// bot.on('disconnect', log('DISCONNECTED'));
// bot.on('reconnecting', log('RECONNECTING'));

/**
 * Called when bot receives messages
 * @param {Message} message => https://discord.js.org/#/docs/main/stable/class/Message
 */
bot.on('message', message => {
	// Make sure the bot doesn't reply to its own messages
	if (message.author.id == bot.user.id) {
		return;
	}

	// Filter out messages that don't start with the prefix or are from the bot itself
	if (!message.content.startsWith(conf.prefix) || message.author.bot) return;

	// Only reply to messages in #kiwipugs and #kiwiverify
	if (message.channel.id != conf.server.pugChannel && message.channel.id != conf.server.verifyChannel) {
		message.reply(strMsgNoDM);
		return;
	}

	dlog(`Got message: ${message.content} from ${message.author.username}`);

	const args = message.content.slice(conf.prefix.length).split(/ +/);
	// const cmd = args.shift().toLowerCase();
	const commandName = args.shift().toLowerCase();

	// Get user privilege level
	const privLevel = priv(message.author.id);
	dlog(`PrivLevel: ${privLevel}`);

	// Check if user linked
	opUser.checkLinked(message.author.id).then((isLinked) => {
		// [TESTING]
		// Command lookup
		let command;
		if (isLinked) {
			dlog(`User linked: ${message.author.id} - yes`);
			command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		}
		else {
			dlog(`User linked: ${message.author.id} - no`);
			command = bot.commandsLink.get(commandName) || bot.commandsLink.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		}

		// If command not found
		if (!command) {
			if(isLinked) {
				message.reply(`\`!${commandName}\` isn't a valid command. Use !help to learn more.`);
				return;
			}
			else {
				message.reply(strMsgNotLinked);
				return;
			}
		}

		// Begin fake bot typing
		message.channel.startTyping();

		// Check for command cooldown entry
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		// Calculate cooldown times
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		// Cooldown expiry
		if (!timestamps.has(message.author.id)) {
			// Create cooldown
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
		else {
			// Expire cooldowns
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}

		// Run avatar and username association
		if (isLinked) {
			opUser.avatarAssoc(message.author.id, message.author.avatarURL);
			// Ensure weirdo Administrator perm breaking doesn't happen when renaming
			if (privLevel != 3) {
				opUser.usernameAssoc(message.author, guild);
			}
		}

		// Execute command
		try {
			command.execute(message, args, privLevel);
		}
		catch (error) {
			log(error);
			message.reply(`our fault, we hit an error somewhere... ${conf.server.adminMention} will look into it further! [CODE: K17]`);
		}
		// [/TESTING]
	}).catch((err) => {
		log(err);
		message.reply(`our fault, we hit an error somewhere... ${conf.server.adminMention} will look into it further! [CODE: K18]`);
	});

	// End the fake typing
	message.channel.stopTyping();
});

/**
 * Gives the provided user the PUG Player role
 * @param {GuildMember} [user] the user to give the role to
 */
function setPUGRole(user) {
	setTimeout(function() {
		dlog(`Set PUG User -> ${user.username} (${user.id})`);
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
	// TODO: Add to queue
	dlog(entity.id);
	// queue.emit('queueJoin', entity);
	parseQueue();
	// Return response
	return 'You cannot be queued up since the PUG queue isn\'t online yet!';
}

// Determines viability of fair game with
// active queued players and parties
function parseQueue() {
	// TODO
	provisionMatch('us-e', ['drop']);
}

/**
 * Operate on the party the user is a part of
 * @param {GuildMember} [user] the user running the command
 * @param {string[]} [args] subcommands and parameters
 * @returns {string} command response text
 */
function party(user, args) {
	dlog(`P: ${user} -> ${args}`);
	return 'Parties aren\'t available yet, sorry pal.';
}

/**
 * Creates a match and provisions a server in the selected region with the specified players
 * @param {string} [region] the region to spawn the server in
 * @param {Collection<string, User>} players a list of players in the match
 */
function provisionMatch(region, players) {
	// TODO
	dlog(`${region} ${players}`);
	provisionClients('', players);
	return;
}

/**
 * Creates match room channel with specified id under the MATCH ROOMS category
 * @param {string} [id] the id of the match room channel
 * @returns {Promise<GuildChannel>} the channel that was created
 * @throws {Promise<string>} error message on rejection
 */
function createMatchRoom(id) {
	return new Promise(function(resolve, reject) {
		baseMatchRoomChannel.clone(`match-pug-${id}`, true, true).then((channel) => {
			channel.setParent(conf.server.matchRoomCategory);
			matchRoomChannels.set(id, channel);
			dlog(`Created matchroom: ${channel.name}`);
			resolve(channel);
		}).catch(() => {
			reject(`FAIL [createMatchRoom: party-${id}]`);
		});
	});
}

/**
 * Creates party channel with specified id under the PARTIES category
 * @param {string} [id] the id of the party channel
 * @returns {Promise<GuildChannel>} the channel that was created
 * @throws {Promise<string>} error message on rejection
 */
function createPartyChannel(id) {
	return new Promise(function(resolve, reject) {
		basePartyChannel.clone(`party-${id}`, true, true).then((channel) => {
			channel.setParent(conf.server.partyCategory);
			partyChannels.set(id, channel);
			dlog(`Created party channel: ${channel.name}`);
			resolve(channel);
		}).catch(() => {
			reject(`FAIL [createPartyChannel: party-${id}]`);
		});
	});
}

/**
 * Deletes a channel given the channel object
 * @param {GuildChannel} [channel] the party channel to delete
 * @param {string} [type='party'] the type of channel (party or match room)
 * @returns {Promise<GuildChannel>} the channel that was deleted
 * @throws {Promise<string>} error message on rejection
 */
function deleteChannel(channel, type = 'party') {
	return new Promise(function(resolve, reject) {
		channel.delete(`Closing channel/matchroom: ${channel.name}`).then((delChannel) => {
			if (type === 'party') {
				const key = partyChannels.findKey('id', delChannel.id);
				partyChannels.delete(key);
				dlog(`Deleted party channel: ${delChannel.name}`);
			}
			else if (type === 'match') {
				const key = matchRoomChannels.findKey('id', delChannel.id);
				matchRoomChannels.delete(key);
				dlog(`Deleted match room channel: ${delChannel.name}`);
			}
			else {
				reject(`FAIL [deleteChannel: invalid channel type -> ${type}`);
			}
			resolve(delChannel);
		}).catch(() => {
			reject(`FAIL [deleteChannel: ${channel.name}`);
		});
	});
}

/**
 * Sends DMs to match players and adds them to the created match room
 * @param {GuildChannel} channel the matchroom channel
 * @param {Collection<string, GuildMember} players the match players
 */
function provisionClients(channel, players) {
	// TODO
	dlog(`${channel} ${players}`);
	return;
}

/**
 * Inititates shutdown procedures
 * @returns nothing
 */
function terminate() {
	// Hard quit if service cannot gracefully shutdown after 10 seconds
	setTimeout(function() {
		log(strForceShutdown, {
			newLinePre: true,
		}).then(() => {
			log(strLogSeparator, {
				stdOut: false,
				usePrefix: false,
			}).then(() => {
				// Terminate with exit code 1
				process.exit(1);
			});
		});
	}, 10 * 1000);
	// Attempt a graceful shutdown on SIGTERM
	bot.destroy().then(() => {
		log(strInitShutdown, {
			newLinePre: true,
		}).then(() => {
			log(strLogSeparator, {
				stdOut: false,
				usePrefix: false,
			}).then(() => {
				// Close db, rcon connections, and etc...
				opUser.dbc.conn().destroy();
				opUser.cache.conn().end();
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

// Startup messages
ascii().then(console.log).then(async () => {
	// Log debug mode
	if(process.env.DEBUG) await dlog('DEBUGGING ENABLED');
	// Init message
	await log(strBotUp);
	// Discord auth
	bot.login(conf.token);
});

// Export all queue and match state functions so command handlers can call them easily
exports.setPUGRole = setPUGRole;
exports.createMatchRoom = createMatchRoom;
exports.createPartyChannel = createPartyChannel;
exports.deleteChannel = deleteChannel;
exports.enqueue = enqueue;
exports.provisionClients = provisionClients;
exports.provisionMatch = provisionMatch;
exports.party = party;
exports.parseQueue = parseQueue;
exports.terminate = terminate;