#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('un')
    .parse(process.argv);

operations.promptUserForConfirmation('uninstall', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.uninstall(location);
});
