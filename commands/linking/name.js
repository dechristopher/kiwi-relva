// kiwi/relva/commands/linking/name.js - Created February 22nd, 2018

const { opUser, setPUGRole } = require('../../index');

module.exports = {
	name: 'name',
	aliases: ['username'],
	description: 'Sets the KIWI username and PUG Player role of a Discord user.',
	execute(message, args) {
		opUser.setUsername(message.author.id, args[0]).then(resp => {
			if (resp.includes('#kiwipugs')) {
				setPUGRole(message.author);
			}
			message.reply(resp);
		});
	},
};