#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('ad')
    .parse(process.argv);

operations.promptUserForConfirmation('add reviewers to', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.add(location);
});
