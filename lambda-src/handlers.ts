/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { FutarService } from './futar-service';
import { ResponseHelper } from './response-helper';
import { states } from './states';

const TRAM_STOP_ID = 'BKK_F02297';

const responseHelper = new ResponseHelper();

export const handlers: Alexa.Handlers = {
  GetNextRideIntent: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    let vehicleName: string = (<Alexa.IntentRequest>this.event.request).intent.slots.Vehicle.value;

    // Switching to the BusHandler when the user asks about bus times.
    if (vehicleName === 'bus') {
      this.handler.state = states.BUS_MODE;
      responseHelper.ask(this, 'Which bus lane do you want to take?', 'Please say the number of the bus!');
      return;
    }

    // Alexa recognizes the word 'bus' better, so any other word (even the empty slot) is handled as a 'tram'.
    vehicleName = 'tram';

    const futarService = new FutarService();
    futarService.getNextRides(TRAM_STOP_ID)
      .then((rides: IRideTimes) => {
        responseHelper.tellRideTimes(this, 'tram', rides);
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
