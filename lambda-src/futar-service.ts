'use strict';

import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import * as rp from 'request-promise-lite';

const TIMEZONE_NAME = 'Europe/Budapest';
const MINUTES_AFTER = 90;

export class FutarService {
  public getNextRidesForStopAndRoute(stopId: string, routeId: string): Promise<IRideTimes> {
    return this._getStopData(stopId)
      .then(stopData => {
        const currentTimeInMilliseconds: number = stopData.currentTime;

        const tripIds: string[] = [];

        const trips = stopData.data.references.trips;

        Object.keys(trips).forEach((key: string) => {
          const trip: ITrip = trips[key];
          if (trip.routeId === routeId) {
            tripIds.push(trip.id);
          }
        });

        const stopTimes: IStopTime[] = stopData.data.entry.stopTimes.filter(stopTime => tripIds.indexOf(stopTime.tripId) > -1);

        const firstRide: IStopTime = stopTimes[0];
        const secondRide: IStopTime = stopTimes[1];

        const rideTimes: IRideTimes = this._getNextRidesInLocalTime(currentTimeInMilliseconds, firstRide, secondRide);
        return rideTimes;
      });
  }

  public getNextRides(stopId: string): Promise<IRideTimes> {
    if (!stopId) {
      throw new Error('Please specify the stopId!');
    }

    return this._getStopData(stopId)
      .then(stopData => {
        const currentTimeInMilliseconds: number = stopData.currentTime;
        const firstRide: IStopTime = stopData.data.entry.stopTimes[0];
        const secondRide: IStopTime = stopData.data.entry.stopTimes[1];

        const rideTimes: IRideTimes = this._getNextRidesInLocalTime(currentTimeInMilliseconds, firstRide, secondRide);
        return rideTimes;
      });
  }

  private _getStopData(stopId: string): Promise<IStopData> {
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

        if (body.data.entry.stopTimes.length === 0) {
          throw new Error('Sorry, there are no more rides today.');
        }

        const result: IStopData = {
          currentTime: body.currentTime,
          data: body.data
        };

        return result;
      });
  }

  private _getNextRidesInLocalTime(currentTimeInMilliseconds: number, firstRide: IStopTime, secondRide: IStopTime): IRideTimes {
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

  private _getRideTimeInLocalTime(ride: IStopTime): moment.Moment {
    const rideTimeInMilliseconds = (ride.predictedArrivalTime || ride.arrivalTime || ride.departureTime) * 1000;
    const rideTimeInLocalTime = this._getTimeInLocalTime(rideTimeInMilliseconds);
    return rideTimeInLocalTime;
  }

  private _getTimeInLocalTime(timeInMilliseconds: number): moment.Moment {
    const timeInGmt = new Date(timeInMilliseconds);
    const timeInLocalTime = momentTimezone(timeInGmt).tz(TIMEZONE_NAME);
    return timeInLocalTime;
  }
}
