'use strict';

var ghdownload = require('github-download');
var files = require('./files');
var path = require('path');

module.exports = {
    downloadAndSaveFromGit: function(gitUrl, outPutDir, done) {
        ghdownload(gitUrl, outPutDir)
            .on('end', function() {
                done();
            });
    }
};
