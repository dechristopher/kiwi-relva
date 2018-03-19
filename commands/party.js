// kiwi/relva/commands/party.js - Created March 8th, 2018

const dlog = require('../modules/util/dlog');

module.exports = {
	name: 'party',
	aliases: ['p'],
	description: 'Allows players to form and manipulate parties.',
	messages: {
		replyInvalidArgument: 'that\'s an invalid operation! Valid party operations are `(j)oin`, `(l)eave`, `(k)ick`, `invite`, `(d)isband` and `(i)nfo`',
		replyPartiesNotAvailable: 'parties aren\'t available yet. Check back later after I\'m done being made!',
	},
	subcommands: ['j', 'join', 'l', 'leave', 'i', 'info', 'k', 'kick', 'invite', 'd', 'disband'],
	execute(message, args, privLevel) {
		if(!args.length) {
			message.reply(this.messages.replyPartiesNotAvailable);
			message.channel.stopTyping();
			return;
		}

		// Ensure user is in party and that command is run within a party channel
		// const channel = message.channel;

		const sub = this.subcommands.find(args[0]);

		// Error out if subcommand not valid
		if (!sub) {
			message.reply(this.messages.replyInvalidArgument);
			message.channel.stopTyping();
			return;
		}

		// Decipher and run subcommands
		if (sub.indexOf('j') === 0) {
			return this.join();
		}
		else if (sub.indexOf('l') === 0) {
			return this.leave();
		}
		else if (sub.indexOf('i') === 0) {
			return this.info(privLevel);
		}
		else if (sub.indexOf('k') === 0) {
			return this.kick();
		}
		else if (sub.indexOf('inv') === 0) {
			return this.invite();
		}
		else if (sub.indexOf('d') === 0) {
			return this.disband();
		}

		// Error if we get this far
		dlog(`[UNIMPLEMENTED SUBCOMMAND] [Queue] -> ${sub}`);
	},
	join() {
		return;
	},
	leave() {
		return;
	},
	kick() {
		return;
	},
	invite() {
		return;
	},
	disband() {
		return;
	},
	info(privLevel) {
		console.log(privLevel);
		return;
	},
};