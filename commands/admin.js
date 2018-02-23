// kiwi/relva/commands/admin.js - Created February 23rd, 2018

module.exports = {
	name: 'admin',
	description: 'Calls an admin and mentions them in the channel.',
	messages: {
		replyAdmin: 'you\'ve come to the right place, <@119966322523242497> will be able to help with whatever questions you may have.',
	},
	execute(message) {
		message.reply(`${this.messages.replyAdmin}`);
	},
};