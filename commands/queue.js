// kiwi/relva/commands/queue.js - Created March 8th, 2018

module.exports = {
	name: 'queue',
	aliases: ['q'],
	description: 'Allows a player or party to join the queue.',
	messages: {
		replyInvalidArgument: 'that\'s an invalid operation! Valid queue operations are `(j)oin`, `(l)eave`, and `(i)nfo`',
		replyQueueNotAvailable: 'the queue isn\'t available yet. Check back later after I\'m done being made!',
	},
	subcommands: ['j', 'join', 'l', 'leave', 'i', 'info'],
	execute(message, args, privLevel) {
		console.log('hit queue');
		if(!args.length) {
			message.reply(this.messages.replyQueueNotAvailable);
			message.channel.stopTyping();
			return;
		}

		// Get subcommand
		const sub = this.subcommands.find(args[0]);

		// Error out if subcommand not valid
		if(!sub) {
			message.reply(this.messages.replyInvalidArgument);
			message.channel.stopTyping();
			return;
		}

		// Decipher and run subcommands
		if(sub.indexOf('j') === 0) {
			return this.join();
		}
		else if(sub.indexOf('l') === 0) {
			return this.leave();
		}
		else if(sub.indexOf('i') === 0) {
			return this.info(privLevel);
		}

		// message.reply(this.messages.replyQueueNotAvailable);
	},
	join() {
		return;
	},
	leave() {
		return;
	},
	info(privLevel) {
		/*
			Regular user: @you, there are currently X players looking for a match in your region.
					 VIP: @you, there are currently X players looking for a match in your region.
				   Admin: @you, there are currently X players in X prties looking for a match.
					  - : DM -> rich text showing all players and parties
		*/
		console.log(privLevel);
		return;
	},
};