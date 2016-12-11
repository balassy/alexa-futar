'use strict';

const moment = require('moment');
const momentTimezone = require('moment-timezone');

const TIMEZONE_NAME = 'Europe/Budapest';

module.exports = class FutarService {

  getNextRidesInLocalTime(currentTimeInMilliseconds, firstRide, secondRide) {
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