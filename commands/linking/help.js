// kiwi/relva/commands/linking/help.js - Created March 9th, 2018

module.exports = {
	name: 'help',
	aliases: ['h'],
	description: 'Gives assistance with commands.',
	messages: {
		replyHelp: 'available commands are: `!link` and `!name`',
	},
	execute(message) {
		message.reply(this.messages.replyHelp);
	},
};