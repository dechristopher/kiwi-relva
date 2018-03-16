// kiwi/relva/commands/linking/link.js - Created February 22nd, 2018

const { opUser } = require('../../index');

module.exports = {
	name: 'link',
	aliases: ['register', 'connect', 'signup'],
	description: 'Link Steam Profile to Discord user.',
	execute(message, args) {
		opUser.linkAccount(message.author.username, message.author.id, args[0]).then(resp => {
			message.reply(resp);
			message.channel.stopTyping();
		});
	},
};