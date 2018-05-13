#!/usr/bin/env node

'use strict';

let sleep = require('./sleep');

function retry(fn, retries) {
  if (typeof(retries)==='undefined') retries = 20;

  console.log("trying: " + fn + " with " + retries + " retries left");
  fn()
  .then(light => {
    console.log(`Updated light [${light.name}] after ${20-retries} retries`);
  })
  .catch(error => {
    retries--;
    console.log('Something went wrong, retrying ' + retries + ' more times...');
    if( retries >= 0 ) {
      sleep(500).then(() => {
        retry(fn, retries);
      });
    } else {
      console.log("can't recover...");
      console.log(error.stack);
      throw error;
    }
  });
}

module.exports = retry;
