#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('rm')
    .parse(process.argv);

operations.promptUserForConfirmation('remove reviewers to', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.remove(location);
});
