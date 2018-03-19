// kiwi/relva/modules/help.js - Created February 5th, 2018

// Command help descriptions
const strHelpAdmin = '`!admin` calls and mentions an admin in the channel.';
const strHelpName = '`!name` allows you to change your KIWI username once a month.';
const strHelpHelp = '`!help` gives more information about certain commands and their usage.';
const strHelpAbout = '`!about` gives some basic information about the KIWI PUG system and KIWIBot.';
const strHelpQueue = '`!queue` allows a user or party to join the PUG or scrim matchmaking queue';
const strHelpParty = '`!party` allows users to create parties to queue into matches together.';

module.exports = function(args, privLevel) {
	// Add privileged commands :>
	// Returns help strings for questioned commands
	let reply;
	switch (args[0].toLowerCase()) {
	case 'admin':
		reply = strHelpAdmin;
		break;

	case 'name':
		reply = strHelpName;
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
};