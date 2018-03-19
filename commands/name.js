// kiwi/relva/commands/name.js - Created March 16th, 2018

const { opUser, guild } = require('../index');

module.exports = {
	name: 'name',
	aliases: ['username'],
	description: 'Sets the KIWI username and of a Discord user.',
	messages: {
		replyInvalidArgs: 'you must specify a username to change to like so: `!name KIWIBot`',
		replySuccess: 'you\'ll now be known as such.',
		replyDumbass: 'that\'s already your username...',
	},
	execute(message, args) {
		if(!args.length) {
			this.die(message, this.messages.replyInvalidArgs);
			return;
		}

		if(args[0] === message.author.nickname) {
			this.die(message, this.messages.replyDumbass);
			return;
		}

		// WARNING: Hacky re-use of old code :<
		opUser.setUsername(message.author.id, args[0]).then(resp => {
			if (resp.includes('#kiwipugs')) {
				// Set username immediately...?
				// NEEDS TO BE MODIFIED TO NOT TRY FOR ADMINS
				opUser.usernameAssoc(message.author, guild);
				// Success
				this.die(message, this.messages.replySuccess);
				return;
			}
			// Invalid or taken username
			this.die(message, resp);
		});
	},
	die(message, resp) {
		message.reply(resp);
		message.channel.stopTyping();
		return;
	},
};