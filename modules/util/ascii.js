// kiwi/relva/modules/ascii.js - Created January 3rd, 2018

// NPM modules
const chalk = require('chalk');

// Pretty-print 'raagi' in green ascii art
// http://patorjk.com/software/taag/#p=display&f=Straight&t=relva
module.exports = function() {
    let time = new Date();
    let year = time.getFullYear();
    console.log(
        chalk.green(`\n _  _ |     _  \n` +
            `|  (- | \\/ (_| \n`) +
        chalk.white(` © kiwi ` + year + `\n`)
    );
};

/*
 _  _ |     _
|  (- | \/ (_|
*/