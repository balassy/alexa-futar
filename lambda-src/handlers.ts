/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { FutarService } from './futar-service';
import { ResponseHelper } from './response-helper';
import { states } from './states';

const TRAM_STOP_ID = 'BKK_F02297';

const responseHelper = new ResponseHelper();

export const handlers: Alexa.Handlers = {
  GetNextRideIntent: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    let vehicleName: string =  (<Alexa.IntentRequest> this.event.request).intent.slots.Vehicle.value;

    // Alexa recognizes the word 'bus' better, so any other word (even the empty slot) is handled as a 'tram'.
    if (vehicleName !== 'bus') {
      vehicleName = 'tram';
    }

    if (vehicleName === 'bus') {
      this.handler.state = states.BUS_MODE;
      this.emit(':ask', 'Which bus lane do you want to take?', 'Please say the number of the bus!');
      return;
    }

    const futarService = new FutarService();
    futarService.getNextRides(TRAM_STOP_ID).then((rides: IRideTimes) => {
        let speechOutput: string;

        if (rides.firstRideRelativeTimeInMinutes >= 8) {
          speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can easily catch it. The second ${vehicleName} goes ${rides.secondRideRelativeTimeHumanized} later at ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 8 && rides.firstRideRelativeTimeInMinutes >= 5) {
          speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You can still catch it. After that you have to wait another ${rides.secondRideRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime}.`;
        }
        else if (rides.firstRideRelativeTimeInMinutes < 5 && rides.firstRideRelativeTimeInMinutes >= 2) {
          speechOutput = `Your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized} at ${rides.firstRideAbsoluteTime}.  You better run, GO, GO, GO! Or you can wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the ${vehicleName} after the next one.`;
        }
        else {
          speechOutput = `Sorry, your next ${vehicleName} goes in ${rides.firstRideRelativeTimeHumanized}, and you probably will not get it. You should wait ${rides.combinedRelativeTimeHumanized} until ${rides.secondRideAbsoluteTime} for the ${vehicleName} after this one.`;
        }

        responseHelper.tell(this, speechOutput);
      })
      .catch((err: Error) => {
        console.log('CATCH ERROR WITHIN GetNextRideIntent: ', err);     // tslint:disable-line:no-console
        const details = `Sorry, your webservice call failed! More information: ${err.message}`;
        responseHelper.tellFailure(this, details);
      });
  },

  Unhandled: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    responseHelper.ask(this, 'You can ask about your next bus or tram.', 'Try asking when goes your next bus or tram.');
  }
};
