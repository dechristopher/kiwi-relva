// kiwi/relva/commands/help.js - Created February 23nd, 2018

const help = require('../modules/help');

module.exports = {
	name: 'help',
	aliases: ['h'],
	description: 'Gives assistance with commands.',
	messages: {
		replyHelp: 'available commands are: `!(q)ueue`, `!(p)arty`, `!(a)bout`, `!admin`, and `!(h)elp` - for command details type `!help <command>`',
	},
	execute(message, args) {
		message.reply((args.length > 0) ? help(args) : this.messages.replyHelp);
		message.channel.stopTyping();
	},
};