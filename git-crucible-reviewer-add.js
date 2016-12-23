#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('ad')
    .parse(process.argv);

addReviewers();

function addReviewers() {
    var reviewers = program.args;
    var action = 'add reviewers to';
    if (reviewers.length === 1) action = 'add reviewer ' + reviewers[0] + ' to';
    if (reviewers.length > 1) action = 'add reviewers ' + reviewers.join(', ') + ' to';

    operations.promptUserForConfirmation(action, {
        description: module.exports.description,
        version: module.exports.version
    }, function(location) {
        operations.add(location, reviewers);
    });
}
