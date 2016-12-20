/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { FutarService } from './futar-service';
import { ResponseHelper } from './response-helper';
import { states } from './states';

const BUS_STOP_ID = 'BKK_F02285';
const BUS_102_ROUTE_ID = 'BKK_1020';
const BUS_110_ROUTE_ID = 'BKK_1100';

const responseHelper = new ResponseHelper();

export const busHandlers: Alexa.Handlers = Alexa.CreateStateHandler(states.BUS_MODE, {
  BusNumberIntent: function (this: Alexa.Handler) {  // tslint:disable-line no-function-expression
    const busNumber: string = (<Alexa.IntentRequest>this.event.request).intent.slots.BusNumber.value;

    let routeId;
    switch (busNumber) {
      case '110': {
        routeId = BUS_110_ROUTE_ID;
        break;
      }
      case '102': {
        routeId = BUS_102_ROUTE_ID;
        break;
      }
      default: {
        responseHelper.redirect(this, 'Unhandled' + states.BUS_MODE);
        return;
      }
    }

    const futarService = new FutarService();
    futarService.getNextRidesForStopAndRoute(BUS_STOP_ID, routeId)
      .then((rides: IRideTimes) => {
        const vehicleName = `bus #${busNumber}`;
        responseHelper.tellRideTimes(this, vehicleName, rides);
        this.handler.state = states.DEFAULT;
      })
      .catch((err: Error) => {
        console.log('CATCH ERROR WITHIN BusNumberIntent: ', err);     // tslint:disable-line:no-console
        const details = `Sorry, your webservice call failed! More information: ${err.message}`;
        responseHelper.tellFailure(this, details);
      });
  },

  Unhandled: function (this: Alexa.Handler) {   // tslint:disable-line no-function-expression
    responseHelper.ask(this, 'Sorry, I could not understand the bus number, please say 102 or 110!', 'Is it 102 or 110?');
  }
});
