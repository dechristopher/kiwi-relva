if (isLinked) {
	dlog(`User linked: ${message.author.id} - yes`);
	// Perform avatar association transaction
	opUser.avatarAssoc(message.author.id, message.author.avatarURL);

	// Run commands
	switch (cmd) {
	case 'ping':
		bot.commands.get('ping').execute(message, args);
		break;

	case 'h':
	case 'help':
		bot.commands.get('help').execute(message, args);
		break;

	case 'a':
	case 'about':
		bot.commands.get('about').execute(message);
		break;

	case 'link':
		bot.commands.get('link').execute(message, args);
		break;

	case 'q':
	case 'queue':
		reply(enqueue(message.author.id));
		break;

	case 'p':
	case 'party':
		// Party operations
		reply(party(args));
		break;

	case 'pi':
		bot.commands.get('pi').execute(message);
		break;

	case 'admin':
		bot.commands.get('admin').execute(message);
		break;

	default:
		reply(`\`!${cmd}\` isn't a valid command. Use !help to learn more.`);
		break;
	}
}
else {
	dlog(`User linked: ${message.author.id} - no`);
	// Check for link attempt
	if (cmd === 'link') {
		bot.commandsLink.get('link').execute(message, args);
	}
	else if (cmd === 'name') {
		bot.commandsLink.get('name').execute(message, args);
	}
	else {
		reply(strMsgNotLinked);
	}
}