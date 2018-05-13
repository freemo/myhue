#!/usr/bin/env node

'use strict';

let huejay      = require('../node_modules/huejay');
let credentials = require('../.credentials.json');

let client = new huejay.Client(credentials);

module.exports = client;
