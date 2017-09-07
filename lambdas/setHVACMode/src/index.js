"use strict";
global.AWS = require("aws-sdk");

const TARGET = 20;
const MIN = TARGET - 5;
const MAX = TARGET + 5;

const ENDPOINT = process.env.ENDPOINT;
const THING_NAME = process.env.THING_NAME;

function setMode(message, mode) {
  return Object.assign({}, message, {
    mode: mode
  });
}

function setFanSpeed(message, speed) {
  return Object.assign({}, message, {
    speed: speed
  });
}

function calcFanSpeed(message, temperature) {
  if(temperature < MIN - 5 || temperature > MAX + 5) {
    return setFanSpeed(message, 3);
  } else if(temperature < MIN - 2 || temperature > MAX + 2) {
    return setFanSpeed(message, 2);
  } else if(temperature < MIN  || temperature > MAX) {
    return setFanSpeed(message, 1);
  } else {
    return setFanSpeed(message, 0);
  }
  return message;
}

function calcMode(message, temperature) {
  if(temperature < MIN) {
    return setMode(message, "heat");
  } else if(temperature > MAX) {
    return setMode(message, "cool");
  } else {
    return setMode(message, "off");
  }
  return message;
}

function sendUpdate(message, callback) {
  let data = new AWS.IotData({endpoint: ENDPOINT});
  let params = {
    thingName: THING_NAME,
    payload: JSON.stringify(message)
  };

  data.updateThingShadow(params, callback);
}

function setHVACMode(event, context, callback) {
  const temperature = event.temperature;

  let message = {};
  message = calcMode(message, temperature);
  message = calcFanSpeed(message, temperature);

  let state = {
    state: {
      desired: message
    }
  }

  sendUpdate(state, function(error, data) {
    if (error) {
      callback(error);
    } else {
      callback(null, "New HVAC state requested: " + JSON.stringify(state));
    }
  });
}

exports.setHVACMode = setHVACMode;
exports.TARGET = TARGET;
