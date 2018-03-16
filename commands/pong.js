// kiwi/relva/commands/ping.js - Created February 22nd, 2018

module.exports = {
	name: 'pong',
	description: 'Pong?',
	messages: {
		replyPong: 'Ping..?',
	},
	execute(message) {
		message.channel.send(`${this.messages.replyPong}`);
		message.channel.stopTyping();
	},
};