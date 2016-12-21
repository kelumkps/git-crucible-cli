#!/usr/bin/env node

'use strict';

var program = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var validator = require('valid-url');

var pkginfo = require('pkginfo')(module, 'version', 'description');
var logo = require('./lib/logo');

program
    .alias('in')
    .parse(process.argv);

logo.display(module.exports.description, module.exports.version);

getCrucibleConfigurations(function(args) {
    console.log(args);
});

function getCrucibleConfigurations(callback) {
    var questions = [{
            name: 'projectPath',
            type: 'input',
            message: 'Enter the path for your Git project:',
            validate: function(value) {
                if (value.length) {
                    var scriptLocation = path.join(value, ".git", "hooks");
                    if (fs.existsSync(scriptLocation)) {
                        return true;
                    }
                }
                return chalk.red("Oops.. We couldn't find a valid git project at this location. Please re-enter the correct path");
            }
        }, {
            name: 'crucibleUrl',
            type: 'input',
            message: 'Enter your Crucible URL:',
            validate: function(value) {
                if (value.length && validator.isWebUri(value)) {
                    return true;
                } else {
                    return chalk.red('Please enter your Crucible URL in the form of http[s]://host:port');
                }
            }
        }, {
            name: 'username',
            type: 'input',
            message: 'Enter your Crucible username:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return chalk.red('Please enter your Crucible username');
                }
            }
        }, {
            name: 'password',
            type: 'password',
            message: 'Enter your Crucible password:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return chalk.red('Please enter your Crucible password');
                }
            }
        }, {
            name: 'projectKey',
            type: 'input',
            message: 'Enter your Crucible project key:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return chalk.red('Please enter your Crucible project key');
                }
            }
        }, {
            name: 'reviewers',
            type: 'input',
            message: 'Enter your Crucible reviewers (separated by space):',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return chalk.red('Please enter your Crucible reviewers (separated by space)');
                }
            }
        }

    ];
    inquirer.prompt(questions).then(callback);
}