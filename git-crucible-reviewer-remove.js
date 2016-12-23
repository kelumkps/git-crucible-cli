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
    var args = program.args;
    var action = 'remove reviewers of';
    if (args.length === 1) action = 'remove reviewer ' + args.join(',') + ' of';
    if (args.length > 1) action = 'remove reviewers ' + args.join(',') + ' of';

    operations.promptUserForConfirmation(action, {
        description: module.exports.description,
        version: module.exports.version
    }, function(location) {
        operations.add(location, args);
    });
}
