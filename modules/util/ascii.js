// kiwi/relva/modules/util/ascii.js - Created January 3rd, 2018

// NPM modules
const chalk = require('chalk');

/**
 * Pretty-print 'raagi' in green ascii art
 * http://patorjk.com/software/taag/#p=display&f=Straight&t=relva
 * @returns {Promise<string>} ascii art
 */
module.exports = function() {
	return new Promise(function(resolve) {
		const time = new Date();
		const year = time.getFullYear();
		const ascii = chalk.green('\n _  _ |     _  \n' + '|  (- | \\/ (_| \n') + chalk.white(' © kiwi ' + year + '\n');
		resolve(ascii);
	});
};

/*
 _  _ |     _
|  (- | \/ (_|
*/