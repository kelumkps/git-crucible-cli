#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('rm')
    .parse(process.argv);

removeReviewers();

function removeReviewers() {
    var reviewers = program.args;
    var action = 'remove reviewers of';
    if (reviewers.length === 1) action = 'remove reviewer ' + reviewers[0] + ' of';
    if (reviewers.length > 1) action = 'remove reviewers ' + reviewers.join(',') + ' of';

    operations.promptUserForConfirmation(action, {
        description: module.exports.description,
        version: module.exports.version
    }, function(location) {
        operations.remove(location, reviewers);
    });
}
