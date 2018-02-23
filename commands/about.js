// kiwi/relva/commands/about.js - Created February 22nd, 2018

module.exports = {
	name: 'about',
	aliases: ['a'],
	description: 'Displays some basic information about KIWI Bot.',
	messages: {
		replyAbout: 'how the heck are ya? I\'m KIWI Bot! Use me like your sick puppet and bend me to your will to use the KIWI PUG service. Use `!help` to learn what I can do.',
	},
	execute(message) {
		message.reply(`${this.messages.replyAbout}`);
	},
};