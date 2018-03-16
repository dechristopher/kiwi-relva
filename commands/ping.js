// kiwi/relva/commands/ping.js - Created February 22nd, 2018

module.exports = {
	name: 'ping',
	description: 'Ping!',
	messages: {
		replyPing: 'Pong!',
	},
	execute(message) {
		message.channel.send(`${this.messages.replyPing}`);
		message.channel.stopTyping();
	},
};