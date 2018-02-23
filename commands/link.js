// kiwi/relva/commands/link.js - Created February 22nd, 2018

module.exports = {
	name: 'link',
	description: 'Tells the user they can\'t link their account again.',
	messages: {
		replyAlreadyLinked: 'your account is already linked properly. Use `!help` to learn more.',
	},
	execute(message) {
		message.reply(`${this.messages.replyAlreadyLinked}`);
	},
};