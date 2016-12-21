#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var files = require('./lib/files');
var logo = require('./lib/logo');

program
    .version(module.exports.version)
    .option('-a, --all','specify all installed scripts')
    .command('install', 'install and configure git-crucible-review-creator script in to a desired git project')
    .command('uninstall [project-path]', 'uninstall git-crucible-review-creator script from a given git project')
    .command('disable [project-path]', 'disable git-crucible-review-creator script from a given git project')
    .command('enable [project-path]', 'enable git-crucible-review-creator script from a given git project')
    .command('reviwer [project-path]', 'show configured reviewers');



//if program was called with no arguments, show help.
if (process.argv.slice(2).length === 0) {
    logo.display(module.exports.description, module.exports.version);
}

program.parse(process.argv);
