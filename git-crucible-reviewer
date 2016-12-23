#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var logo = require('./lib/logo');

program
    .alias('rw')
    .command('add [username]', 'Add a reviewer to the git-crucible-review-creator script of a given git project')
    .command('remove [username]', 'Remove a reviewer to the git-crucible-review-creator script of a given git project');

//if program was called with no arguments, show help.
if (process.argv.slice(2).length === 0) {
    logo.display(module.exports.description, module.exports.version);
}

program.parse(process.argv);
