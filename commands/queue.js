// kiwi/relva/commands/queue.js - Created March 8th, 2018

module.exports = {
	name: 'queue',
	aliases: ['q'],
	description: 'Allows a user or party to join the queue.',
	messages: {
		replyQueueNotAvailable: 'the queue isn\'t available yet. Check back later after I\'m done being made!',
	},
	execute(message) {
		message.reply(`${this.messages.replyQueueNotAvailable}`);
	},
};