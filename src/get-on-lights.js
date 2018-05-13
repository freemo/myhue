#!/usr/bin/env node

'use strict';

let client = require('./init-client');

let getOnLights = function getOnLights(fn) {
  client.lights.getAll()
    .then(lights => {
      var onLights = [];
      for (let light of lights) {
        if( light.on ) {
          console.log(`light is on: ${light.name}`)
          onLights.push(light);
        }
        else {
          console.log(`light is off: ${light.name}`)
        }
      }
      fn(onLights);
    })
    .catch(error => {
      console.log(error.stack);
    });
}

module.exports = getOnLights;
