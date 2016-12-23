'use strict';

var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');

var Spinner = require('./spinner');
var files = require('./files');
var downloader = require('./git-downloader');
var preferences = require('./preferences');
var logo = require('./logo');

module.exports = {
    install: function(answers) {
        var status = Spinner.create('Downloading latest git-crucible-review-creator script, please wait...');
        status.start();
        var gitHubRepoUrl = 'https://github.com/kelumkps/git-crucible-review-creator.git#master';
        var downloadPath = path.join(files.getAppDirectoryPath(), 'git-crucible-review-creator');
        files.remove(downloadPath);
        downloader.downloadAndSaveFromGit(gitHubRepoUrl, downloadPath, function() {
            Spinner.update(status, 'Download is completed, applying configurations...');
            var destFile = path.join(answers["projectPath"], ".git", "hooks", "pre-push");
            files.copyOrReplace(path.join(files.getAppDirectoryPath(), 'git-crucible-review-creator', 'pre-push'), destFile);
            files.replaceInFile(destFile, "#HOST_PORT#", answers["crucibleUrl"].replace(/\/+$/, ""));
            files.replaceInFile(destFile, "#PROJECT_KEY#", answers["projectKey"].trim());
            files.replaceInFile(destFile, "#USERNAME#", answers["username"].trim());
            files.replaceInFile(destFile, "#PASSWORD_IN_BASE64#", Buffer.from(answers["password"]).toString('base64'));
            files.replaceInFile(destFile, "#COMMA_SEPERATED_USERNAMES#", answers["reviewers"].split(/[ ,]+/).filter(function(v) {
                return v !== ''
            }).join(','));
            Spinner.update(status, 'Cleaning up resources...');
            files.remove(downloadPath);
            preferences.insertProjectRecord(answers["projectPath"]);
            Spinner.update(status, 'Installation is completed successfully!');
            status.stop();
        });
    },

    uninstall: function(location) {
        var status = Spinner.create('Uninstalling git-crucible-review-creator, please wait...');
        status.start();
        files.remove(path.join(location, ".git", "hooks", "pre-push"));
        files.remove(path.join(location, ".git", "hooks", "pre-push.git-crucible-back"));
        preferences.removeProjectRecord(location);
        Spinner.update(status, 'Uninstallation is completed successfully!');
        status.stop();
    },

    disable: function(location) {
        var status = Spinner.create('Disabling git-crucible-review-creator, please wait...');
        status.start();
        var srcFile = path.join(location, ".git", "hooks", "pre-push");
        if (files.fileExists(srcFile)) {
            var destFile = path.join(location, ".git", "hooks", "pre-push.git-crucible-back");
            files.rename(srcFile, destFile);
            Spinner.update(status, 'git-crucible-review-creator is now disabled!');
            status.stop();
        } else {
            console.log(chalk.red("Oops.. We couldn't locate enabled git-crucible-review-creator in this location."));
            terminate();
        }
    },

    enable: function(location) {
        var status = Spinner.create('Enabling git-crucible-review-creator, please wait...');
        status.start();
        var srcFile = path.join(location, ".git", "hooks", "pre-push.git-crucible-back");
        if (files.fileExists(srcFile)) {
            var destFile = path.join(location, ".git", "hooks", "pre-push");
            files.rename(srcFile, destFile);
            Spinner.update(status, 'git-crucible-review-creator is now enabled!');
            status.stop();
        } else {
            console.log(chalk.red("Oops.. We couldn't locate disabled git-crucible-review-creator in this location."));
            terminate();
        }
    },

    add: function(location, reviewers) {
        var srcFile = path.join(location, ".git", "hooks", "pre-push");
        if (!files.fileExists(srcFile)) {
            srcFile = path.join(location, ".git", "hooks", "pre-push.git-crucible-back");
            if (!files.fileExists(srcFile)) {
                console.log(chalk.red("Oops.. We couldn't locate installed git-crucible-review-creator in this location."));
                terminate();
            }
        }

        if (reviewers.length) {
            addReviewers(srcFile, reviewers);
        } else {
            var questions = [{
                name: 'reviewer',
                type: 'input',
                message: 'Enter your Crucible reviewers (separated by space):',
                validate: function(value) {
                    if (value.trim().length) {
                        return true;
                    } else {
                        return chalk.red('Please enter your Crucible reviewers (separated by space)');
                    }
                }
            }];
            inquirer.prompt(questions).then(function(answers) {
                var inputReviewers = answers["reviewer"].split(/[ ,]+/);
                addReviewers(srcFile, inputReviewers);
            });
        }
    },

    remove: function(location) {
        console.log(location);
    },

    terminate: function() {
        terminate();
    },

    promptUserForConfirmation: function(action, appDetails, done) {
        findSelectedProject(appDetails, function(location) {
            if (location && location !== null) {
                handleLocationFound(location, action, done);
            } else {
                logo.display(appDetails.description, appDetails.version);
                handleLocationNotFound(action, function(userInput) {
                    handleLocationFound(userInput, action, done);
                });
            }
        });
    },

    findSelectedProject: function(appDetails, done) {
        findSelectedProject(appDetails, done);
    },

    handleLocationFound: function(location, action, done) {
        handleLocationFound(location, action, done);
    },

    handleLocationNotFound: function(action, done) {
        handleLocationNotFound(action, done);
    }
};

function invokeCallBackAsync(param, callback) {
    setTimeout(function() {
        callback(param);
    }, 0);
}

function terminate() {
    console.log(chalk.green("Terminating  the operation. Good Bye and have a nice day!"));
    process.exit(0);
}

function addReviewers(filePath, reviewers) {
    var message = 'Adding reviewers to git-crucible-review-creator, please wait...';
    if (reviewers.length === 1) message = 'Adding a reviewer to git-crucible-review-creator, please wait...';
    var status = Spinner.create(message);
    status.start();
    files.readLineContainsStr(filePath, 'reviewers=', function(line) {
        var currentReviewers = line.replace('reviewers="', '').replace('"', '').split(",");
        var newReviewers = currentReviewers.concat(reviewers);
        var uniqueReviewers = newReviewers.filter(function(elem, pos) {
            return newReviewers.indexOf(elem) == pos && elem !== '';
        });
        var newLine = 'reviewers="' + uniqueReviewers.join(',') + '"';
        files.replaceInFile(filePath, line, newLine);

        var updatedMessage = reviewers.join(', ') + ' are added successfully as reviewers!';
        if (reviewers.length === 1) updatedMessage = reviewers[0] + ' is added successfully as a reviewer!';
        Spinner.update(status, updatedMessage);
        status.stop();
    });
}

function findSelectedProject(appDetails, done) {
    var path = preferences.containsRecordLike(files.getCurrentDirectoryBase());
    if (path && path !== null) {
        invokeCallBackAsync(path, done);
    } else {
        var choices = preferences.getAvailableRecords();
        if (choices.length === 0) {
            invokeCallBackAsync(null, done);
        } else {
            logo.display(appDetails.description, appDetails.version);
            inquirer.prompt([{
                type: 'list',
                name: 'selectedPath',
                message: 'Please select a location from below.',
                choices: choices
            }]).then(function(answers) {
                done(answers['selectedPath']);
            });
        }
    }
}

function handleLocationFound(location, action, done) {
    inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to ' + action + ' git-crucible-review-creator from [' + location + '] ?'
    }]).then(function(answers) {
        if (answers['confirm']) {
            done(location);
        } else {
            terminate();
        }
    });
}

function handleLocationNotFound(action, done) {
    console.log(chalk.red("Sorry, we couldn't find any location where git-crucible-review-creator is installed."));
    var questions = [{
        name: 'selectedPath',
        type: 'input',
        message: 'Enter the path for your Git project to ' + action + ' git-crucible-review-creator:',
        validate: function(value) {
            if (value.length) {
                var scriptLocation = path.join(value, ".git", "hooks");
                if (files.directoryExists(scriptLocation)) {
                    return true;
                }
            }
            return chalk.red("Oops.. We couldn't find a valid git project at this location. Please re-enter the correct path");
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        done(answers['selectedPath']);
    });
}
