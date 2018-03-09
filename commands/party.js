// kiwi/relva/commands/party.js - Created March 8th, 2018

module.exports = {
	name: 'party',
	aliases: ['p'],
	description: 'Allows players to form and manipulate parties.',
	messages: {
		replyPartiesNotAvailable: 'parties aren\'t available yet. Check back later after I\'m done being made!',
	},
	execute(message) {
		message.reply(`${this.messages.replyPartiesNotAvailable}`);
	},
};