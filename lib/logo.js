'use strict';

var chalk = require('chalk');
var figlet = require('figlet');

module.exports = {
    display: function(description, version) {
        console.log(
            chalk.cyan.bold(
                figlet.textSync('Git-Crucible', {
                    horizontalLayout: 'fitted'
                })
            )
        );
        console.log("");
        console.log(chalk.magenta(description));
        console.log(chalk.green(chalk.gray.bold("Version: ") + version));
    }
};
