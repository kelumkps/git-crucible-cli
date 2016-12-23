'use strict';

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var os = require('os');
var replace = require('replace-in-file');
var appDir = path.join(os.homedir(), ".git_crucible");

module.exports = {
    getCurrentDirectoryBase: function() {
        return path.basename(process.cwd());
    },

    directoryExists: function(filePath) {
        if (!fs.existsSync(filePath)) return false;
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },

    getHomeDirectoryPath: function() {
        return os.homedir();
    },

    getAppDirectoryPath: function() {
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir);
        }
        return appDir;
    },

    remove: function(directory) {
        if (fs.existsSync(directory)) {
            fse.removeSync(directory);
        }
    },

    copyOrReplace: function(src, dest) {
        fse.copySync(src, dest);
    },

    replaceInFile: function(filePath, target, replacement) {
        try {
            var changedFiles = replace.sync({
                files: filePath,
                replace: target,
                with: replacement
            });
        } catch (error) {
            return false;
        }
        return true;
    },

    getAbsolutePath: function(filePath) {
        return path.resolve(filePath);
    },

    
};
