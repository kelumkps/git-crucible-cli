'use strict';

var CLI = require('clui'),
    Spinner = CLI.Spinner;

module.exports = {
    create: function(message) {
        var spinner = new Spinner(message);
        return spinner;
    },

    update: function(spinner, message) {
        setTimeout(function() {
            spinner.message(message);
            process.stdout.write(message + '\n');
        }, 0);
    }
};
