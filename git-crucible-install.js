#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version', 'description');
var logo = require('./lib/logo');

program
  .alias('in')
  .parse(process.argv);

logo.display(module.exports.description, module.exports.version);
