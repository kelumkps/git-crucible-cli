#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var operations = require('./lib/operations');

program
    .alias('di')
    .parse(process.argv);

operations.promptUserForConfirmation('disable', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.disable(location);
});
