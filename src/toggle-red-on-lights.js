#!/usr/bin/env node

'use strict';

let client = require('./init-client');
let getOnLights = require('./get-on-lights');
let sleep = require('./sleep');
let retry = require('./retry');

client.lights.getAll()
  .then(lights => {
    var onLights = [];
    var prevBright = [];
    var prevHue = [];
    var prevSaturation = [];
    var prevColorMode = [];
    var prevXy = [];
    var prevTemp = [];

    for (let light of lights) {
      if(light.on && !(typeof(light.colorMode)==='undefined')) {
        onLights.push(light);
        prevBright.push(light.brightness);
        prevHue.push(light.hue);
        prevSaturation.push(light.saturation);
        prevColorMode.push(light.colorMode);
        prevXy.push(light.xy);
        prevTemp.push(light.colorTemp);

        light.brightness = 254;
        light.saturation = 254;
        light.hue = 0;

        retry(() => client.lights.save(light) );
      }
    }

    sleep(20000).then(() => {
      for (let i = 0; i < onLights.length; i++) {
        onLights[i].brightness = prevBright[i];
        if(prevColorMode[i].includes("hs")) {
          onLights[i].hue = prevHue[i];
          onLights[i].saturation = prevSaturation[i];
        }

        if(prevColorMode[i].includes("xy")) {
          onLights[i].xy = prevXy[i];
        }

        if(prevColorMode[i].includes("ct")) {
          onLights[i].colorTemp = prevTemp[i];
        }

        retry(() => client.lights.save(onLights[i]) );
      }
    });
  })
  .catch(error => {
    console.log(error.stack);
  });

// let client = require('./init-client');
// let getOnLights = require('./get-on-lights');
// let sleep = require('./sleep');
// let retry = require('./retry');
//
// function toggleRedOnLights(onLights) {
//   var prevBright = [];
//   var prevHue = [];
//   var prevSaturation = [];
//   var prevColorMode = [];
//   var prevXy = [];
//   var prevTemp = [];
//   for (var i = 0; i < onLights.length; i++) {
//     var onLight = onLights[i];
//     prevBright.push(onLight.brightness);
//     prevHue.push(onLight.hue);
//     prevSaturation.push(onLight.saturation);
//     prevColorMode.push(onLight.colorMode);
//     prevXy.push(onLight.xy);
//     prevTemp.push(onLight.colorTemp);
//
//     //onLight.brightness = 254;
//     onLight.saturation = 254;
//     onLight.hue = 1;
//
//     console.log(`setting to red: ${onLight.name}, ${onLight.colorMode}`);
//     retry(() => client.lights.save(onLight) );
//   }
// }
//
// getOnLights(toggleRedOnLights);
