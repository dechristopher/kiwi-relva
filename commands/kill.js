// kiwi/relva/commands/kill.js - Created March 1st, 2018

const { terminate } = require('../index');

module.exports = {
	name: 'kill',
	description: 'Terminates the bot immediately.',
	messages: {
		replyKill: 'I\'m shutting down now. Bye...',
		replyFakeNotCommand: '`kill` isn\'t a valid command. Use !help to learn more.',
	},
	execute(message, args, privLevel) {
		if(privLevel === 2) {
			message.reply(this.messages.replyKill);
			terminate();
		}
		else {
			message.reply(this.messages.replyFakeNotCommand);
		}
	},
};