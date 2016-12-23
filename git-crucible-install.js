#!/usr/bin/env node

'use strict';

var program = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var url = require('url-join');
var chalk = require('chalk');
var validator = require('valid-url');
var request = require('request');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var logo = require('./lib/logo');
var files = require('./lib/files');
var Spinner = require('./lib/spinner');
var operations = require('./lib/operations');

program
    .alias('in')
    .parse(process.argv);

logo.display(module.exports.description, module.exports.version);

promptUserForConfigurations(function(answers) {
    validateUserInputs(answers, function() {
        verifyHttps(answers, function() {
            operations.install(answers);
        });
    });
});

function verifyHttps(answers, done) {
    if (!validator.isHttpsUri(answers['crucibleUrl'])) {
        var message = "The given Crucible URL is not using HTTPS which is not secure enough. Do you want to continue anyway?";
        getConfirmation(message, function(confirm) {
            if (confirm.proceed) {
                done();
            } else {
                terminate();
            }
        });
    } else {
        done();
    }
}

function validateUserInputs(answers, done) {
    var status = Spinner.create('Let us verify your inputs, please wait...');
    status.start();
    var crucibleProjectUrl = url(answers['crucibleUrl'], 'rest-service', 'projects-v1', answers['projectKey']);

    request.get(crucibleProjectUrl, {
        'auth': {
            'user': answers['username'],
            'pass': answers['password']
        }
    }, function(error, response) {
        status.stop();
        if (!error && response.statusCode == 200) {
            console.log(chalk.green("Verified your inputs successfully. Proceeding with the next step..."));
            done();
        } else {
            var message = "Unable to connect to the Crucible server at this moment. Do you want to continue anyway?";
            getConfirmation(message, function(confirm) {
                if (confirm.proceed) {
                    done();
                } else {
                    terminate();
                }
            });
        }
    });
}

function getConfirmation(message, done) {
    var questions = [{
        name: 'proceed',
        type: 'confirm',
        message: chalk.red(message)
    }];
    inquirer.prompt(questions).then(done);
}

function terminate() {
    console.log(chalk.green("Terminating  the installation. Good Bye and have a nice day!"));
    process.exit(0);
}

function promptUserForConfigurations(done) {
    var questions = [{
            name: 'projectPath',
            type: 'input',
            message: 'Enter the path for your Git project:',
            validate: function(value) {
                if (value.length) {
                    var scriptLocation = path.join(value, ".git", "hooks");
                    if (files.directoryExists(scriptLocation)) {
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
    inquirer.prompt(questions).then(done);
}
