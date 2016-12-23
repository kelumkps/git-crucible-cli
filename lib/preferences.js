'use strict';

var Preferences = require("preferences");
var files = require('./files');

var prefs = new Preferences('com.github.kelumkps.git-crucible-cli', {
    'projects': []
});

module.exports = {
    insertProjectRecord: function(projectPath) {
        projectPath = files.getAbsolutePath(projectPath);
        if (!isProjectRecordAvailable(projectPath)) {
            if (!prefs.projects) prefs.projects = [];
            prefs.projects.push(projectPath);
        }
    },

    isProjectRecordAvailable: function(record) {
        return isProjectRecordAvailable(files.getAbsolutePath(record));
    },

    removeProjectRecord: function(projectPath) {
        projectPath = files.getAbsolutePath(projectPath);
        var installedProjects = prefs.projects || [];
        for (var i = installedProjects.length - 1; i >= 0; i--) {
            if (installedProjects[i] === projectPath) {
                installedProjects.splice(i, 1);
            }
        }
    },

    getAvailableRecords: function() {
        var installedProjects = prefs.projects || [];
        return installedProjects.slice();
    },

    containsRecordLike: function(record) {
        record = files.getAbsolutePath(record);
        var installedProjects = prefs.projects || [];
        for (var i in installedProjects) {
            var path = installedProjects[i];
            if (record.indexOf(path) != -1) {
                return path;
            }
        }
        return null;
    }
};

function isProjectRecordAvailable(record) {
    var installedProjects = prefs.projects || [];
    var recordFound = false;
    for (var i in installedProjects) {
        var path = installedProjects[i];
        if (record === path) {
            recordFound = true;
            break;
        }
    }
    return recordFound;
}
