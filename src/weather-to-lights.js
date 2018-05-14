#!/usr/bin/env node

'use strict';

const getWeather = require('./get-weather');
let client = require('./init-client');
let getOnLights = require('./get-on-lights');
let sleep = require('./sleep');
let retry = require('./retry');

const COLD_XY = [0.1355, 0.0399];
const NORMAL_XY = [0.477, 0.5042];
const HOT_XY = [0.7006, 0.2993];

getWeather(weather => {
  let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  console.log(message);

  let tempXy = NORMAL_XY;
  if(weather.main.temp > 74) {
    tempXy = HOT_XY;
  } else if( weather.main.temp < 62 ) {
    tempXy = COLD_XY;
  }

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
          light.xy = tempXy;

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
});
