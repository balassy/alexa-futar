'use strict';

const moment = require('moment');
const momentTimezone = require('moment-timezone');
const rp = require('request-promise-lite');

const TIMEZONE_NAME = 'Europe/Budapest';
const MINUTES_AFTER = 90;

module.exports = class FutarService {

  getNextRides(stopId) {
    const url = `http://futar.bkk.hu/bkk-utvonaltervezo-api/ws/otp/api/where/arrivals-and-departures-for-stop.json?stopId=${stopId}&onlyDepartures=true&minutesBefore=0&minutesAfter=${MINUTES_AFTER}`;

    const options = {
      resolveWithFullResponse: true,
      json: true
    };

    return rp.get(url, options)
      .then(response => {
        if (response.statusCode !== 200) {
          throw new Error('Sorry, your webservice call failed with HTTP ${response.statusCode} status code! The server returned: ${JSON.stringify(response)}');
        }

        const body = response.body;

        if (body.version !== 2) {
          throw new Error(`The Futár webservice returned a response body with a version different than 2: ${response.version}`);
        }

        if (body.status !== 'OK') {
          throw new Error(`The Futár webservice returned a response body with a status different than OK: ${response.status}`);
        }

        if (body.code !== 200) {
          throw new Error(`The Futár webservice returned a response body with a code different than 200: ${response.code}`);
        }

        const currentTimeInMilliseconds = body.currentTime;
        const firstRide = body.data.entry.stopTimes[0];
        const secondRide = body.data.entry.stopTimes[1];

        const rideTimes = this._getNextRidesInLocalTime(currentTimeInMilliseconds, firstRide, secondRide);
        return rideTimes;
      })
  }

  _getNextRidesInLocalTime(currentTimeInMilliseconds, firstRide, secondRide) {
    const currentTimeInLocalTime = this._getTimeInLocalTime(currentTimeInMilliseconds);
    const firstRideTimeInLocalTime = this._getRideTimeInLocalTime(firstRide);
    const secondRideTimeInLocalTime = this._getRideTimeInLocalTime(secondRide);

    const firstRideRelativeTime = moment.duration(firstRideTimeInLocalTime.diff(currentTimeInLocalTime));
    const secondRideRelativeTime = moment.duration(secondRideTimeInLocalTime.diff(firstRideTimeInLocalTime));
    const combinedRelativeTime = moment.duration(secondRideTimeInLocalTime.diff(currentTimeInLocalTime));

    return {
      firstRideAbsoluteTime: firstRideTimeInLocalTime.format('HH:mm'),
      firstRideRelativeTimeInMinutes: firstRideRelativeTime.minutes(),
      firstRideRelativeTimeHumanized: firstRideRelativeTime.humanize(),
      secondRideAbsoluteTime: secondRideTimeInLocalTime.format('HH:mm'),
      secondRideRelativeTimeHumanized: secondRideRelativeTime.humanize(),
      combinedRelativeTimeHumanized: combinedRelativeTime.humanize()
    };
  }

  _getRideTimeInLocalTime(ride) {
    const rideTimeInMilliseconds = (ride.predictedArrivalTime || ride.arrivalTime || ride.departureTime) * 1000;
    const rideTimeInLocalTime = this._getTimeInLocalTime(rideTimeInMilliseconds);
    return rideTimeInLocalTime;
  }

  _getTimeInLocalTime(timeInMilliseconds) {
    const timeInGmt = new Date(timeInMilliseconds);
    const timeInLocalTime = momentTimezone(timeInGmt).tz(TIMEZONE_NAME);
    return timeInLocalTime;
  }
}