// kiwi/relva/commands/help.js - Created February 23nd, 2018

const help = require('../modules/help');

module.exports = {
	name: 'help',
	aliases: ['h'],
	description: 'Gives assistance with commands.',
	messages: {
		replyHelp: 'available commands are: `!queue`, `!party`, `!about`, `!admin`, `!name` and `!help` - for command details type `!help <command>`',
	},
	execute(message, args, privLevel) {
		message.reply((args.length > 0) ? help(args, privLevel) : this.messages.replyHelp);
		message.channel.stopTyping();
	},
};