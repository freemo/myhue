#!/usr/bin/env node

'use strict';

let client = require('./init-client');
let getOnLights = require('./get-on-lights');
let sleep = require('./sleep');
let retry = require('./retry');

client.lights.getAll()
  .then(lights => {
    let onLights = [];

    for (let light of lights) {
      if(light.on && !(typeof(light.colorMode)==='undefined')) {
        let lightData = {
          "light":light,
          "brightness":light.brightness,
          "hue":light.hue,
          "saturation":light.saturation,
          "colorMode":light.colorMode,
          "xy":light.xy,
          "colorTemp":light.colorTemp
        };
        onLights.push(lightData);

        light.brightness = 254;
        light.saturation = 254;
        light.hue = 0;

        retry(() => client.lights.save(light) );
      }
    }

    sleep(20000).then(() => {
      for (let lightData of onLights) {
        let light = lightData.light;

        light.brightness = lightData.brightness;
        if(light.colorMode.includes("hs")) {
          light.hue = lightData.hue;
          light.saturation = lightData.saturation;
        }

        if(light.colorMode.includes("xy")) {
          light.xy = lightData.xy;
        }

        if(light.colorMode.includes("ct")) {
          light.colorTemp = lightData.colorTemp;
        }


        retry(() => client.lights.save(light) );
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
