
'use strict';

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let retry = function retry(fn, retries) {
  if (typeof(retries)==='undefined') retries = 20;

  fn()
  .then(light => {
    console.log(`Updated light [${light.id}]`);
  })
  .catch(error => {
    retries--;
    console.log('Something went wrong, retrying ' + retries + ' more times...');
    if( retries >= 0 ) {
      sleep(500).then(() => {
        retry(fn, retries);
      });
    } else {
      throw error;
    }
  });
}

module.exports = retry;
