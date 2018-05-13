#!/usr/bin/env node

'use strict';

let client = require('./init-client');
let retry = require('./retry');

client.lights.getAll()
  .then(lights => {
    for (let light of lights) {
      console.log(`toggling light ${light.name}[${light.id}] to on? ${!light.on}`);
      light.on = !light.on

      //saveLight(light);
      retry(() => client.lights.save(light) );
    }
  })
  .catch(error => {
    console.log(error.stack);
  });
