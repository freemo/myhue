#!/usr/bin/env node

'use strict';

const request = require('../node_modules/request');
let apiKey = require('../.weather-api-key');

let city = 'philadelphia';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

function getWeather(fn) {
  request(url, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body)
      fn(weather);
    }
  });
}

module.exports = getWeather;
