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
            files.replaceInFile(destFile, "#PROJECT_KEY#", answers["projectKey"]);
            files.replaceInFile(destFile, "#USERNAME#", answers["username"]);
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
        var status = Spinner.create('Uninstalling git-crucible-review-creator script, please wait...');
        status.start();
        var destFile = path.join(location, ".git", "hooks", "pre-push");
        files.remove(destFile);
        preferences.removeProjectRecord(location);
        Spinner.update(status, 'Uninstallation is completed successfully!');
        status.stop();
    },

    terminate: function() {
        terminate();
    },

    findSelectedProject: function(done, app) {
        var path = preferences.containsRecordLike(files.getCurrentDirectoryBase());
        if (path && path !== null) {
            invokeCallBackAsync(done, path);
        } else {
            var choices = preferences.getAvailableRecords();
            if (choices.length === 0) {
                invokeCallBackAsync(done, null);
            } else {
                logo.display(app.description, app.version);
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
    },

    handleLocationFound: function(location, done, ops) {
        inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to ' + ops + ' git-crucible-review-creator from [' + location + '] ?'
        }]).then(function(answers) {
            if (answers['confirm']) {
                done(location);
            } else {
                terminate();
            }
        });
    },

    handleLocationNotFound: function(done, ops) {
        console.log(chalk.red("Sorry, we couldn't find any location where git-crucible-review-creator is installed."));
        var questions = [{
            name: 'selectedPath',
            type: 'input',
            message: 'Enter the path for your Git project to ' + ops + ' git-crucible-review-creator:',
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
};

function invokeCallBackAsync(callback, param) {
    setTimeout(function() {
        callback(param);
    }, 0);
}

function terminate() {
    console.log(chalk.green("Terminating  the operation. Good Bye and have a nice day!"));
    process.exit(0);
}
