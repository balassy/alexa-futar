/* tslint:disable:no-invalid-this */

import * as Alexa from 'alexa-sdk';
import { routeIds, states, stopIds } from './consts';
import { FutarService } from './futar-service';
import { ResponseHelper } from './response-helper';

const responseHelper = new ResponseHelper();

export const busHandlers: Alexa.Handlers = Alexa.CreateStateHandler(states.BUS_MODE, {
  BusNumberIntent: function (this: Alexa.Handler) {  // tslint:disable-line no-function-expression
    const busNumber: string = (<Alexa.IntentRequest>this.event.request).intent.slots.BusNumber.value;

    let routeId;
    switch (busNumber) {
      case '110': {
        routeId = routeIds.BUS_110;
        break;
      }
      case '102': {
        routeId = routeIds.BUS_102;
        break;
      }
      default: {
        responseHelper.redirect(this, 'Unhandled' + states.BUS_MODE);
        return;
      }
    }

    const futarService = new FutarService();
    futarService.getNextRidesForStopAndRoute(stopIds.BUS, routeId)
      .then((rides: IRideTimes) => {
        this.handler.state = states.DEFAULT;
        const vehicleName = `bus #${busNumber}`;
        responseHelper.tellRideTimes(this, vehicleName, rides);
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
