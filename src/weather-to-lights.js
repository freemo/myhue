#!/usr/bin/env node

'use strict';

const getWeather = require('./get-weather');

getWeather(weather => {
  let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  console.log(message);
});
