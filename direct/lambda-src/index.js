'use strict';

const http = require('http');
const Alexa = require('alexa-sdk');
const FutarService = require('./futar-service');

const SKILL_NAME = 'Next Ride';
const TRAM_STOP_ID = 'BKK_F02296';
const MINUTES_AFTER = 90;
const SERVICE_URL = `http://futar.bkk.hu/bkk-utvonaltervezo-api/ws/otp/api/where/arrivals-and-departures-for-stop.json?stopId=${TRAM_STOP_ID}&onlyDepartures=true&minutesBefore=0&minutesAfter=${MINUTES_AFTER}`;

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetNextRide');
  },
  'GetNextRideIntent': function () {
    this.emit('GetNextRide');
  },
  'GetNextRide': function () {
    http.get(SERVICE_URL, (result) => {
      let body = '';

      result.on('data', (chunk) => {
        body += chunk;
      });

      result.on('end', () => {
        const response = JSON.parse(body);
        const speechOutput = buildSpeechOutputFromResponse(response);

        this.emit(':tell', speechOutput);
      });
    }).on('error', (err) => {
      const speechOutput = 'Sorry, your webservice call failed! Check the Alexa app for more details.';
      const cardTitle = SKILL_NAME;
      const cardContent = 'Sorry, your webservice call failed! ' + JSON.stringify(err);

      this.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
    });
  }
};

function buildSpeechOutputFromResponse(response) {
  if (response.version !== 2) {
    return `The Futár webservice returned a response body with a version different than 2: ${response.version}`;
  }

  if (response.status !== 'OK') {
    return `The Futár webservice returned a response body with a status different than OK: ${response.status}`;
  }

  if (response.code !== 200) {
    return `The Futár webservice returned a response body with a code different than 200: ${response.code}`;
  }

  const currentTimeInMilliseconds = response.currentTime;

  const nextRide = response.data.entry.stopTimes[0];
  const nextRideTimeInSeconds = nextRide.predictedArrivalTime || nextRide.arrivalTime || nextRide.departureTime;

  const futarService = new FutarService();
  const ride = futarService.getNextRideInLocalTime(currentTimeInMilliseconds, nextRideTimeInSeconds * 1000);

  const actionSentence = ride.relativeTimeInMinutes < 4
    ? 'You better run!'
    : 'You can easily catch it.';

  return `Your next tram goes in ${ride.relativeTimeHumanized} at ${ride.absoluteTime}.  ${actionSentence}`;
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
