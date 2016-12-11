'use strict';

const moment = require('moment');
const momentTimezone = require('moment-timezone');

const TIMEZONE_NAME = 'Europe/Budapest';

module.exports = class FutarService {

  getNextRideInLocalTime(currentTimeInMilliseconds, rideTimeInMilliseconds) {
    const currentTimeInGmt = new Date(currentTimeInMilliseconds);
    const currentTimeInLocalTime = momentTimezone(currentTimeInGmt).tz(TIMEZONE_NAME);

    const rideTimeInGmt = new Date(rideTimeInMilliseconds);
    const rideTimeInLocalTime = momentTimezone(rideTimeInGmt).tz(TIMEZONE_NAME);

    const relativeTime = moment.duration(rideTimeInLocalTime.diff(currentTimeInLocalTime));

    return {
      absoluteTime: rideTimeInLocalTime.format('HH:mm'),
      relativeTimeInMinutes: relativeTime.minutes(),
      relativeTimeHumanized: relativeTime.humanize()
    };
  }
}