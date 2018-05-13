#!/usr/bin/env node

'use strict';

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = sleep;
