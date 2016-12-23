'use strict';

var path = require('path');
var Spinner = require('./spinner');
var files = require('./files');
var downloader = require('./git-downloader');
var preferences = require('./preferences');

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
    }
};
