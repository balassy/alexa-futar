/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { FutarService } from './futar-service';
const skillConfig = require('./config/skill.json');  // tslint:disable-line no-require-imports no-var-requires 

const TRAM_STOP_ID = 'BKK_F02296';

export const handlers: Alexa.Handlers = {
  LaunchRequest: function () {
    this.emit('GetNextRide');
  },
  GetNextRideIntent: function () {
    this.emit('GetNextRide');
  },
  GetNextRide: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    const futarService = new FutarService();
    futarService.getNextRides(TRAM_STOP_ID)
      .then((rides: IRideTimes) => {
        let speechOutput: string;

        if (rides.firstRideRelativeTimeInMinutes >= 8) {
          speechOutput = `Your next tram goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can easily catch it. The second tram goes ${rides.secondRideRelativeTimeHumanized} later at ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 8 && rides.firstRideRelativeTimeInMinutes >= 5) {
          speechOutput = `Your next tram goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can still catch it. After that you have to wait another ${rides.secondRideRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 5 && rides.firstRideRelativeTimeInMinutes >= 2) {
          speechOutput = `Your next tram goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You better run, GO, GO, GO! Or you can wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the tram after the next one.`;
        }
        else {
          speechOutput = `Sorry, your next tram goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}, and you probably will not get it. You should wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the tram after this one.`;
        }

        emitSuccess(this, speechOutput);
      })
      .catch((err: Error) => {
        console.log('CATCH ERROR: ', err);     // tslint:disable-line:no-console
        const details = `Sorry, your webservice call failed! More information: ${err.message}`;
        emitFailure(this, details);
      });
  }
};

/**
 * Produces a successful response to the user.
 * @param {string} speechOutput - The message to say to the user.
 */
function emitSuccess(handlerContext: Alexa.Handler, speechOutput: string) {
  handlerContext.emit(':tell', speechOutput);
}

/**
 * Produces a failure response to the user. 
 * @param {string} details - Additional information about the failure.
 */
function emitFailure(handlerContext: Alexa.Handler, details: string) {
  const speechOutput = 'Sorry, your webservice call failed! Check the Alexa app for more details.';
  const cardTitle = skillConfig.name;
  const cardContent = details;
  handlerContext.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
}
