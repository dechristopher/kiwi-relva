// kiwi/relva/commands/pi.js - Created February 22nd, 2018

module.exports = {
	name: 'pi',
	description: 'For those that need to know the ratio of a circle\'s circumference to its diameter.',
	messages: {
		replyPi: '3.141592653589793238462...',
	},
	execute(message) {
		message.channel.send(`${this.messages.replyPi}`);
	},
};