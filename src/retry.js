#!/usr/bin/env node

'use strict';

let sleep = require('./sleep');

function retry(fn, retries) {
  if (typeof(retries)==='undefined') retries = 20;

  fn()
  .then(light => {
    console.log(`Updated light [${light.name}] after ${20-retries} retries`);
  })
  .catch(error => {
    retries--;
    if( retries >= 0 ) {
      sleep(500).then(() => {
        retry(fn, retries);
      });
    } else {
      console.log(error.stack);
      throw error;
    }
  });
}

module.exports = retry;
