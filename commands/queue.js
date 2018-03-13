// kiwi/relva/commands/queue.js - Created March 8th, 2018

module.exports = {
	name: 'queue',
	aliases: ['q'],
	description: 'Allows a user or party to join the queue.',
	messages: {
		replyInvalidArgument: 'that\'s an invalid operation! Valid queue operations are `(j)oin`, `(l)eave`, and `(i)nfo`',
		replyQueueNotAvailable: 'the queue isn\'t available yet. Check back later after I\'m done being made!',
	},
	subcommands: ['j', 'join', 'l', 'leave', 'i', 'info'],
	execute(message, args) {
		const sub = this.subcommands.find(args[0]);

		// Error out if subcommand not valid
		if(!sub) {
			message.reply(`${this.messages.replyInvalidArgument}`);
		}

		// Decipher and run subcommands
		if(sub.indexOf('j') === 0) {
			return this.join();
		}
		else if(sub.indexOf('l') === 0) {
			return this.leave();
		}
		else if(sub.indexOf('i') === 0) {
			return this.info();
		}

		// message.reply(`${this.messages.replyQueueNotAvailable}`);
	},
	join() {
		return;
	},
	leave() {
		return;
	},
	info() {
		return;
	},
};