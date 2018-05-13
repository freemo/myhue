
'use strict';

let sleep = function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = sleep;
