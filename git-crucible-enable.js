#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('en')
    .parse(process.argv);

operations.promptUserForConfirmation('enable', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.enable(location);
});
