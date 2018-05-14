#!/usr/bin/env node

'use strict';

const getWeather = require('./get-weather');
let client = require('./init-client');
let getOnLights = require('./get-on-lights');
let sleep = require('./sleep');
let retry = require('./retry');

const MAX_TEMP = 90.0;
const MIN_TEMP = 32.0;
const NOMINAL_TEMP = 68.0;
const COLD_XY = [0.1355, 0.0399];
const NOMINAL_XY = [0.35, 0.25];
const HOT_XY = [0.7006, 0.2993];

function getTempColorXy(temp) {
  let tempAdj = temp;
  if( tempAdj > MAX_TEMP )
    tempAdj = MAX_TEMP;
  else if(tempAdj < MIN_TEMP)
    tempAdj = MIN_TEMP;

  let tempPerc = 0.0;
  if( tempAdj > NOMINAL_TEMP ) {
    let tempPerc = Math.abs((tempAdj - NOMINAL_TEMP) / (MAX_TEMP - NOMINAL_TEMP));
    let x = NOMINAL_XY[0] + (NOMINAL_XY[0] < HOT_XY[0] ? 1 : -1) * Math.abs(NOMINAL_XY[0] - HOT_XY[0]) * tempPerc;
    let y = NOMINAL_XY[1] + (NOMINAL_XY[1] < HOT_XY[1] ? 1 : -1) * Math.abs(NOMINAL_XY[1] - HOT_XY[1]) * tempPerc;
    return [x, y];
  } else if( tempAdj < NOMINAL_TEMP ) {
    let tempPerc = Math.abs((tempAdj - NOMINAL_TEMP) / (NOMINAL_TEMP - MIN_TEMP));
    let x = NOMINAL_XY[0] + (NOMINAL_XY[0] < COLD_XY[0] ? 1 : -1) * Math.abs(NOMINAL_XY[0] - COLD_XY[0]) * tempPerc;
    let y = NOMINAL_XY[1] + (NOMINAL_XY[1] < COLD_XY[1] ? 1 : -1) * Math.abs(NOMINAL_XY[1] - COLD_XY[1]) * tempPerc;
    return [x, y];
  }
  return NOMINAL_XY;
}

getWeather(weather => {
  let tempXy = getTempColorXy(weather.main.temp);

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
