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

promptUserForConfirmation(function(location) {
    operations.uninstall(location);
});

function promptUserForConfirmation(done) {
    operations.findSelectedProject(function(location) {
        if (location && location !== null) {
            operations.handleLocationFound(location, done, 'uninstall');
        } else {
            logo.display(module.exports.description, module.exports.version);
            operations.handleLocationNotFound(function(userInput) {
                operations.handleLocationFound(userInput, done, 'uninstall');
            }, 'uninstall');
        }
    }, {
        description: module.exports.description,
        version: module.exports.version
    });
}
