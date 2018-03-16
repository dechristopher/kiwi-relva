// kiwi/relva/commands/party.js - Created March 8th, 2018

module.exports = {
	name: 'party',
	aliases: ['p'],
	description: 'Allows players to form and manipulate parties.',
	messages: {
		replyInvalidArgument: 'that\'s an invalid operation! Valid party operations are `(j)oin`, `(l)eave`, `(k)ick`, `invite`, `(d)isband` and `info`',
		replyPartiesNotAvailable: 'parties aren\'t available yet. Check back later after I\'m done being made!',
	},
	subcommands: ['j', 'join', 'l', 'leave', 'info', 'k', 'kick', 'invite', 'd', 'disband'],
	execute(message, args) {
		// Ensure user is in party and that command is run within a party channel
		// const channel = message.channel;

		const sub = this.subcommands.find(args[0]);

		// Error out if subcommand not valid
		if (!sub) {
			message.reply(`${this.messages.replyInvalidArgument}`);
			message.channel.stopTyping();
			return;
		}
		message.reply(`${this.messages.replyPartiesNotAvailable}`);
		message.channel.stopTyping();
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
	info() {
		return;
	},
};