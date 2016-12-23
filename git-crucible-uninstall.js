#!/usr/bin/env node

'use strict';

var program = require('commander');
var path = require('path');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var logo = require('./lib/logo');
var operations = require('./lib/operations');
var files = require('./lib/files');


program
    .alias('un')
    .parse(process.argv);

operations.promptUserForConfirmation('uninstall', {
    description: module.exports.description,
    version: module.exports.version
}, function(location) {
    operations.uninstall(location);
});
